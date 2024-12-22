import { User } from "../types/User";

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "user",
  photoURL: "~/assets/avatar.jpg", // Changed from avatar to photoURL
  adoptedParishes: ["1"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export async function getUserProfile(): Promise<User> {
  return mockUser;
}