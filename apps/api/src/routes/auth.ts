import express from 'express';
import { authController } from '@/controllers/auth.controller';
import { validateRequest } from '@/middlewares/validate';
import { LoginSchema } from '@repo/schema';

const router = express.Router();

router.post('/login', validateRequest(LoginSchema), authController.login);

export default router;
