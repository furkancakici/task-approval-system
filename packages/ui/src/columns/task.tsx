import { TaskStatus, TaskPriority, TaskCategory } from '@repo/types';

export const getStatusColor = (status: string) => {
  switch (status) {
    case TaskStatus.APPROVED: return 'green';
    case TaskStatus.REJECTED: return 'red';
    case TaskStatus.PENDING: return 'yellow';
    default: return 'teal';
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case TaskCategory.TECHNICAL_SUPPORT: return 'blue';
    case TaskCategory.LEAVE_REQUEST: return 'orange';
    case TaskCategory.PURCHASE: return 'grape';
    case TaskCategory.OTHER: return 'teal';
    default: return 'teal';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case TaskPriority.URGENT: return 'red';
    case TaskPriority.HIGH: return 'orange';
    case TaskPriority.NORMAL: return 'blue';
    case TaskPriority.LOW: return 'teal';
    default: return 'teal';
  }
};
