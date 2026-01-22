import prisma from '@/lib/prisma';
import { TaskStatus, TaskPriority, TaskCategory, UserRole } from '@repo/types';
import { getIO } from '@repo/socket/server';
import { SocketEvents } from '@repo/socket';

export const taskService = {
  async getTasks(filters: any, user: any) {
    const { status, priority, category, page = 1, limit = 10 } = filters;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    // Filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { user: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    // Access Control
    if (user.type !== 'admin') {
      // Employees can only see their own tasks
      where.userId = user.id;
    }

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: status === TaskStatus.PENDING ? { createdAt: 'desc' as const } : { updatedAt: 'desc' as const },
        skip,
        take,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  },

  async getTaskById(id: string, user: any) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });

    if (!task) return null;

    // Access Check
    if (user.type !== 'admin' && task.userId !== user.id) {
      throw new Error('Access denied');
    }

    return task;
  },

  async createTask(data: any, userId: string) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority as TaskPriority,
        category: data.category as TaskCategory,
        status: TaskStatus.PENDING,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    try {
      getIO().emit(SocketEvents.TASK_CREATED, task);
    } catch (error) {
      console.error('Socket emit error:', error);
    }

    return task;
  },

  async updateTask(id: string, data: any, user: any) {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) throw new Error('Task not found');

    const updateData: any = {};

    if (user.type === 'admin') {
      const canApprove = [UserRole.ADMIN, UserRole.MODERATOR].includes(user.role);

      if (data.status) {
        if (!canApprove) throw new Error('Viewers cannot change status');
        updateData.status = data.status;

        if (data.status === TaskStatus.REJECTED && data.rejectionReason) {
          updateData.rejectionReason = data.rejectionReason;
        }
      }
    } else {
      // Regular user
      if (existingTask.userId !== user.id) throw new Error('Access denied');

      // Cannot change status
      if (data.status && data.status !== existingTask.status) {
        throw new Error('Employees cannot change task status');
      }

      // Can edit details
      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;
      if (data.priority) updateData.priority = data.priority;
      if (data.category) updateData.category = data.category;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    try {
      getIO().emit(SocketEvents.TASK_UPDATED, updatedTask);
    } catch (error) {
      console.error('Socket emit error:', error);
    }

    return updatedTask;
  },

  async deleteTask(id: string, user: any) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new Error('Task not found');

    if (user.type !== 'admin') {
      if (task.userId !== user.id) throw new Error('Access denied');
      if (task.status !== TaskStatus.PENDING) throw new Error('Cannot delete processed tasks');
    } else {
      if (user.role === UserRole.VIEWER) throw new Error('Viewers cannot delete tasks');
    }

    const deletedTask = await prisma.task.delete({ where: { id } });
    try {
      getIO().emit(SocketEvents.TASK_DELETED, { id });
    } catch (error) {
      console.error('Socket emit error:', error);
    }
    return deletedTask;
  },

  async getTaskStats(user: any) {
    const where: any = {};

    if (user.type !== 'admin') {
      where.userId = user.id;
    }

    const [total, pending, approved, rejected] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.count({ where: { ...where, status: TaskStatus.PENDING } }),
      prisma.task.count({ where: { ...where, status: TaskStatus.APPROVED } }),
      prisma.task.count({ where: { ...where, status: TaskStatus.REJECTED } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  },
};
