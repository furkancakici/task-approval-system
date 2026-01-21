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

    // Get 5 most recent tasks
    const recentActivity = await prisma.task.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return {
      totalUsers,
      pendingTasks,
      completedTasks,
      recentActivity
    };
  }
};
