import { Request, Response } from 'express';
import { taskService } from '@/services/task.service';

export const taskController = {
  async getTasks(req: any, res: Response) {
    try {
      const tasks = await taskService.getTasks(req.query, req.user);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  },

  async getTaskById(req: any, res: Response) {
    try {
      const task = await taskService.getTaskById(req.params.id, req.user);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error: any) {
      if (error.message === 'Access denied') {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error fetching task' });
    }
  },

  async createTask(req: any, res: Response) {
    try {
      const task = await taskService.createTask(req.body, req.user.id);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error creating task', error });
    }
  },

  async updateTask(req: any, res: Response) {
    try {
      const updatedTask = await taskService.updateTask(req.params.id, req.body, req.user);
      res.json(updatedTask);
    } catch (error: any) {
      if (error.message === 'Task not found') return res.status(404).json({ message: error.message });
      if (
        error.message === 'Access denied' ||
        error.message === 'Viewers cannot change status' ||
        error.message === 'Employees cannot change task status'
      ) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error updating task', error });
    }
  },

  async deleteTask(req: any, res: Response) {
    try {
      await taskService.deleteTask(req.params.id, req.user);
      res.json({ message: 'Task deleted' });
    } catch (error: any) {
      if (error.message === 'Task not found') return res.status(404).json({ message: error.message });
      if (error.message === 'Access denied' || error.message === 'Viewers cannot delete tasks') {
        return res.status(403).json({ message: error.message });
      }
      if (error.message === 'Cannot delete processed tasks') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error deleting task' });
    }
  },
};
