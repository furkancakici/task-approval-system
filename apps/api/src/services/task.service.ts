import prisma from '@/lib/prisma';
import { TaskStatus, TaskPriority, TaskCategory, UserRole } from '@repo/types';

export const taskService = {
  async getTasks(filters: any, user: any) {
    const { status, priority, category } = filters;
    const where: any = {};
    
    // Filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (filters.search) {
        where.title = { contains: filters.search, mode: 'insensitive' };
    }

    // Access Control
    if (user.type !== 'admin') {
        // Employees can only see their own tasks
        where.userId = user.id;
    } 

    return prisma.task.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getTaskById(id: string, user: any) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } }
    });

    if (!task) return null;

    // Access Check
    if (user.type !== 'admin' && task.userId !== user.id) {
        throw new Error('Access denied');
    }

    return task;
  },

  async createTask(data: any, userId: string) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority as TaskPriority,
        category: data.category as TaskCategory,
        status: TaskStatus.PENDING,
        userId
      }
    });
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

    return prisma.task.update({
      where: { id },
      data: updateData
    });
  },

  async deleteTask(id: string, user: any) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new Error('Task not found');

    if (user.type !== 'admin') {
        if (task.userId !== user.id) throw new Error('Access denied');
        if (task.status !== TaskStatus.PENDING) throw new Error('Cannot delete processed tasks');
    } else {
        if(user.role === UserRole.VIEWER) throw new Error('Viewers cannot delete tasks');
    }

    return prisma.task.delete({ where: { id } });
  }
};
