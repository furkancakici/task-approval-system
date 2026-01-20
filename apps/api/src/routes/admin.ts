import { Router } from 'express';
import { authenticateToken, requireRole } from '@/middlewares/auth';
import { adminController } from '@/controllers/admin.controller';
import { UserRole } from '@repo/types';

const router = Router();

// Apply authentication and admin role requirement
router.use(authenticateToken);
router.use(requireRole([UserRole.ADMIN, UserRole.MODERATOR]));

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', adminController.getStats);

export default router;
