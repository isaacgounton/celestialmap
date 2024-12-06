import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { Product } from "../../types/Product";

interface ProductCardProps {
    product: Product;
    onTap: () => void;
    row: number;
    col: number;
}

export function ProductCard({ product, onTap, row, col }: ProductCardProps) {
    return (
        <stackLayout
            row={row}
            col={col}
            className="bg-white m-1 rounded-lg shadow-sm"
            onTap={onTap}
        >
            <image src={product.image} className="w-full h-32 rounded-t-lg" />
            <stackLayout className="p-2">
                <label className="font-semibold" text={product.name} />
                <label className="text-gray-600 text-sm" text={product.parishName} />
                <label className="text-blue-500 font-bold" text={`${product.currency}${product.price}`} />
            </stackLayout>
        </stackLayout>
    );
}

const styles = StyleSheet.create({});