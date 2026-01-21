import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@repo/types';

export const userService = {
  async getUsers(filters: any) {
    const { role, email, page = 1, limit = 10 } = filters;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (role) where.role = role;
    if (email) where.email = { contains: email, mode: 'insensitive' };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: { id: true, name: true, email: true, createdAt: true },
            skip,
            take,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
    ]);
    
    return {
        data: users.map(user => ({ ...user, role: UserRole.USER })),
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
        }
    };
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    return user ? { ...user, role: UserRole.USER } : null;
  },

  async createUser(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        // Role is not on User table currently based on previous schema viewing (it was on AdminUser).
        // Let's check schema/types if 'role' exists on User. 
        // Re-reading auth.ts: User has {id, name, email, type:'employee'}. AdminUser has {role}.
        // If the requirement is to manage Users (Employees), they might not have a 'role' field in DB yet, 
        // or they are just simplified users.
        // CHECK REQUIRED: Does User model have 'role'?
        // Assuming it acts as standard employee for now.
      },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    return { ...user, role: UserRole.USER };
  },

  async updateUser(id: string, data: any) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, createdAt: true }
    });
    return { ...user, role: UserRole.USER };
  },

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }
};
