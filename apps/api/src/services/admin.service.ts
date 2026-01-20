import prisma from '@/lib/prisma';

export const adminService = {
  async getStats() {
    // Count total users (employees)
    const totalUsers = await prisma.user.count();

    // Count pending tasks
    const pendingTasks = await prisma.task.count({
      where: { status: 'pending' }
    });

    // Count completed tasks (approved + rejected)
    const completedTasks = await prisma.task.count({
      where: { 
        status: { in: ['approved', 'rejected'] }
      }
    });

    return {
      totalUsers,
      pendingTasks,
      completedTasks
    };
  }
};
