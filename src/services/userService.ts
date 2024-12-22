import { User } from "../types/User";

const mockUser: User = {
  uid: "1", // Added uid
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  displayName: "John Doe", // Added displayName
  role: "user",
  photoURL: "~/assets/avatar.jpg",
  adoptedParishes: ["1"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export async function getUserProfile(): Promise<User> {
  return mockUser;
}