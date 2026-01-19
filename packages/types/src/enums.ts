export enum UserRole {
  ADMIN = 'Admin',
  MODERATOR = 'Moderator',
  VIEWER = 'Viewer',
}

export enum TaskPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TaskCategory {
  TECHNICAL_SUPPORT = 'Technical Support',
  LEAVE_REQUEST = 'Leave Request',
  PURCHASE = 'Purchase',
  OTHER = 'Other',
}
