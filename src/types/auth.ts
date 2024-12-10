export interface User {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  adoptedParishes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}