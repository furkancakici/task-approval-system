import { z } from 'zod';
import { UserRole } from '@repo/types';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'validation.nameMin'),
  email: z.string().email('validation.emailInvalid'),
  password: z.string().min(6, 'validation.passwordMin'),
  role: z.nativeEnum(UserRole),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2, 'validation.nameMin').optional(),
  email: z.string().email('validation.emailInvalid').optional(),
  password: z.string().min(6, 'validation.passwordMin').optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export const UserQuerySchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  email: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserQueryInput = z.infer<typeof UserQuerySchema>;
