import { TaskPriority, TaskStatus } from './enums';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority | string;
  category: string;
  status: TaskStatus | string;
  createdBy: string; // User ID or Name
  createdAt: string;
  rejectionReason?: string;
}
