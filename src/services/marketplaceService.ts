import { Product } from "../types/Product";

const mockProducts: Product[] = [
    {
        id: "1",
        name: "Prayer Book",
        description: "Official CCC Prayer Book",
        price: 19.99,
        currency: "$",
        image: "~/assets/prayer-book.jpg",
        parishId: "1",
        parishName: "CCC First Parish",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "2",
        name: "White Robe",
        description: "Traditional Celestial Church Robe",
        price: 49.99,
        currency: "$",
        image: "~/assets/white-robe.jpg",
        parishId: "1",
        parishName: "CCC First Parish",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export async function getProducts(): Promise<Product[]> {
    return mockProducts;
}