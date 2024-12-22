export interface User {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  adoptedParishes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  phone?: string;
  language?: string;
  bio?: string;
  adoptedParishes?: string[];
  role?: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}