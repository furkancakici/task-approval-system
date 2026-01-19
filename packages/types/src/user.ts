import { UserRole } from './enums';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AdminUser extends User {
  role: UserRole | string;
}
