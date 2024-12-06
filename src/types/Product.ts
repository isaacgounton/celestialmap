export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image: string;
    parishId: string;
    parishName: string;
    createdAt: Date;
    updatedAt: Date;
}