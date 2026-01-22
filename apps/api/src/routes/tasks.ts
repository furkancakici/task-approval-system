import express from 'express';
import { authenticateToken } from '@/middlewares/auth';
import { taskController } from '@/controllers/task.controller';
import { validateRequest, validateQuery } from '@/middlewares/validate';
import { CreateTaskSchema, UpdateTaskSchema, TaskQuerySchema } from '@repo/schema';

const router = express.Router();

router.get('/', authenticateToken, validateQuery(TaskQuerySchema), taskController.getTasks);
router.get('/stats', authenticateToken, taskController.getTaskStats);
router.get('/:id', authenticateToken, taskController.getTaskById);
router.post('/', authenticateToken, validateRequest(CreateTaskSchema), taskController.createTask);
router.patch('/:id', authenticateToken, validateRequest(UpdateTaskSchema), taskController.updateTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);

export default router;
