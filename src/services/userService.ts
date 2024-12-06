import { User } from "../types/User";

const mockUser: User = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "~/assets/avatar.jpg",
    adoptedParishes: ["1"],
    createdAt: new Date(),
    updatedAt: new Date()
};

export async function getUserProfile(): Promise<User> {
    return mockUser;
}