import prisma from '@/lib/prisma';

export const adminService = {
  async getStats() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalUsers, pendingTasks, todayApproved, todayRejected, priorityStats, recentActivity] = await Promise.all([
      prisma.user.count(),
      prisma.task.count({ where: { status: 'pending' } }),
      prisma.task.count({
        where: {
          status: 'approved',
          updatedAt: { gte: startOfToday },
        },
      }),
      prisma.task.count({
        where: {
          status: 'rejected',
          updatedAt: { gte: startOfToday },
        },
      }),
      prisma.task.groupBy({
        by: ['priority'],
        _count: { _all: true },
      }),
      prisma.task.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    return {
      totalUsers,
      pendingTasks,
      todayApproved,
      todayRejected,
      priorityStats: priorityStats.reduce((acc: any, curr) => {
        acc[curr.priority] = curr._count._all;
        return acc;
      }, {}),
      recentActivity,
    };
  },
};
