import * as React from "react";
import { StyleSheet } from "react-nativescript";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onTap?: () => void;
}

export function Card({ children, className = "", onTap }: CardProps) {
    return (
        <stackLayout
            className={`bg-white p-4 rounded-lg shadow-md ${className}`}
            onTap={onTap}
        >
            {children}
        </stackLayout>
    );
}

const styles = StyleSheet.create({});