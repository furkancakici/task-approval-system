import { z } from 'zod';
import { TaskStatus, TaskPriority, TaskCategory } from '@repo/types';

export const CreateTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.nativeEnum(TaskPriority),
  category: z.nativeEnum(TaskCategory),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: z.nativeEnum(TaskCategory).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  rejectionReason: z.string().optional(),
}).refine((data) => {
  if (data.status === TaskStatus.REJECTED && !data.rejectionReason) {
    return false;
  }
  return true;
}, {
  message: "Rejection reason is required when status is REJECTED",
  path: ["rejectionReason"],
});

export const TaskQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: z.nativeEnum(TaskCategory).optional(),
  search: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskQueryInput = z.infer<typeof TaskQuerySchema>;
