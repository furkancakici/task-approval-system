import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('validation.emailInvalid'),
  password: z.string().min(1, 'common.required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
