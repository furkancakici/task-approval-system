import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { UserRole } from '@repo/types';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const authService = {
  async login(email: string, password: string) {
    // Check in Employees
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, type: 'employee' }, JWT_SECRET, { expiresIn: '1d' });
        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, type: 'employee' } };
      }
    }

    // Check in AdminUsers
    const adminUser = await prisma.adminUser.findUnique({ where: { email } });
    if (adminUser) {
      const isValid = await bcrypt.compare(password, adminUser.password);
      if (isValid) {
        const token = jwt.sign({ id: adminUser.id, email: adminUser.email, role: adminUser.role, type: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return { 
          token, 
          user: { 
            id: adminUser.id, 
            name: adminUser.name, 
            email: adminUser.email, 
            role: adminUser.role, 
            type: 'admin' 
          } 
        };
      }
    }

    throw new Error('Invalid credentials');
  }
};
