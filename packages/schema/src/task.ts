import { z } from 'zod';
import { TaskStatus, TaskPriority, TaskCategory } from '@repo/types';

export const CreateTaskSchema = z.object({
  title: z.string().min(3, 'validation.titleMin'),
  description: z.string().min(10, 'validation.descriptionMin'),
  priority: z.nativeEnum(TaskPriority),
  category: z.nativeEnum(TaskCategory),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(3, 'validation.titleMin').optional(),
  description: z.string().min(10, 'validation.descriptionMin').optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: z.nativeEnum(TaskCategory).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  rejectionReason: z.string().min(5, 'validation.rejectionReasonMin').optional(),
}).refine((data) => {
  if (data.status === TaskStatus.REJECTED && !data.rejectionReason) {
    return false;
  }
  return true;
}, {
  message: "validation.rejectionReasonRequired",
  path: ["rejectionReason"],
});

export const TaskQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: z.nativeEnum(TaskCategory).optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskQueryInput = z.infer<typeof TaskQuerySchema>;
