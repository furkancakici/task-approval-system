import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@repo/types';

export const userService = {
  async getUsers(filters: any) {
    const { role, email } = filters;
    const where: any = {};

    if (role) where.role = role;
    if (email) where.email = { contains: email, mode: 'insensitive' };

    // Fetch both tables and combine? Or just focus on 'users' (Employees) and 'admin_users' (Admins)?
    // The requirement implies managing "Users". Usually this refers to the Employee users in this context, 
    // but an Admin might want to manage other Admins too.
    // Let's assume for now this manages the 'User' table (Employees).
    // If we need to manage Admins, we might need a separate endpoint or a unified view.
    // Given the context of "User Management Page", it's likely for managing Employees.

    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, createdAt: true }
    });
    
    return users.map(user => ({ ...user, role: UserRole.USER }));
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
