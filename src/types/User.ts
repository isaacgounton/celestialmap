export interface User {
  uid: string;
  id: string;
  name: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  photoURL?: string;
  avatar?: string;
  adoptedParishes?: string[];
  createdAt: string;
  updatedAt: string;
  bio?: string;
  language?: string;
  phone?: string;
}