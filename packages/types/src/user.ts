import { UserRole } from './enums';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser extends User {
  // Add admin specific fields here if any
}
