import { Request, Response } from 'express';
import { userService } from '@/services/user.service';

export const userController = {
  async getUsers(req: any, res: Response) {
    try {
      const users = await userService.getUsers(req.query);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  },

  async getUserById(req: any, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  },

  async createUser(req: any, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Prisma unique constraint error
        return res.status(409).json({ message: 'Email already exists' });
      }
      res.status(500).json({ message: 'Error creating user', error });
    }
  },

  async updateUser(req: any, res: Response) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(500).json({ message: 'Error updating user', error });
    }
  },

  async deleteUser(req: any, res: Response) {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(500).json({ message: 'Error deleting user' });
    }
  },
};
