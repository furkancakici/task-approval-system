import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole, TaskPriority, TaskStatus, TaskCategory } from '@repo/types';

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create Users (Employees)
  const password = await bcrypt.hash('123456', 10);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@test.com',
      password,
      name: 'Test Employee 1',
      role: UserRole.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@test.com',
      password,
      name: 'Test Employee 2',
      role: UserRole.USER,
    },
  });

  console.log('✅ Created employees');

  // Create Admin Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const modPassword = await bcrypt.hash('mod123', 10);
  const viewerPassword = await bcrypt.hash('viewer123', 10);

  await prisma.adminUser.create({
    data: {
      email: 'admin@test.com',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  await prisma.adminUser.create({
    data: {
      email: 'moderator@test.com',
      password: modPassword,
      name: 'Moderator User',
      role: UserRole.MODERATOR,
    },
  });

  await prisma.adminUser.create({
    data: {
      email: 'viewer@test.com',
      password: viewerPassword,
      name: 'Viewer User',
      role: UserRole.VIEWER,
    },
  });

  console.log('✅ Created admin users');

  // Create Tasks
  const categories = Object.values(TaskCategory);
  const priorities = Object.values(TaskPriority);
  const statuses = [TaskStatus.PENDING, TaskStatus.APPROVED, TaskStatus.REJECTED];

  console.log('🌱 Creating tasks...');

  for (let i = 0; i < 20; i++) {
    const status = statuses[i % 3];
    const user = i % 2 === 0 ? user1 : user2;
    const priority = priorities[i % priorities.length] || TaskPriority.NORMAL;
    const category = categories[i % categories.length] || TaskCategory.OTHER;

    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 1000000000));
    const isProcessed = status !== TaskStatus.PENDING;
    // Set updatedAt to a random time between createdAt and now if processed
    const updatedAt = isProcessed 
      ? new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime()))
      : createdAt;

    await prisma.task.create({
      data: {
        title: `Test Task ${i + 1}`,
        description: `This is a description for test task ${i + 1}. It is important.`,
        priority: priority,
        category: category,
        status: status,
        userId: user.id,
        rejectionReason: status === TaskStatus.REJECTED ? 'Bu bir reddedilmiş görevdir.' : null,
        createdAt,
        updatedAt,
      },
    });
  }
  console.log('🚀 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
