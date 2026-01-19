import express from 'express';
import { authenticateToken, requireRole } from '@/middlewares/auth';
import { userController } from '@/controllers/user.controller';
import { validateRequest, validateQuery } from '@/middlewares/validate';
import { CreateUserSchema, UpdateUserSchema, UserQuerySchema } from '@repo/schema';
import { UserRole } from '@repo/types';

const router = express.Router();

// All routes require authentication and Admin/Moderator role
// Assuming Moderators can view but maybe not delete? 
// For now, let's restrict all management to Admins.
// Or: Users: Read (Admin/Mod), Write (Admin).

router.use(authenticateToken);
router.use(requireRole([UserRole.ADMIN])); // Strict Admin-only for now

router.get('/', validateQuery(UserQuerySchema), userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateRequest(CreateUserSchema), userController.createUser);
router.patch('/:id', validateRequest(UpdateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
