export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  photoURL?: string;
  adoptedParishes?: string[]; // Add adoptedParishes property
  createdAt?: string;
  updatedAt?: string;
}