export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    adoptedParishes: string[];
    createdAt: Date;
    updatedAt: Date;
}