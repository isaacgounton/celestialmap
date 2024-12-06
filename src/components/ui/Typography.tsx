import * as React from "react";
import { StyleSheet } from "react-nativescript";

interface TypographyProps {
    children: React.ReactNode;
    variant?: "h1" | "h2" | "h3" | "body" | "caption";
    className?: string;
}

export function Typography({ 
    children, 
    variant = "body", 
    className = "" 
}: TypographyProps) {
    const getVariantClass = () => {
        switch (variant) {
            case "h1":
                return "text-2xl font-bold";
            case "h2":
                return "text-xl font-semibold";
            case "h3":
                return "text-lg font-medium";
            case "caption":
                return "text-sm text-gray-600";
            default:
                return "text-base";
        }
    };

    return (
        <label className={`${getVariantClass()} ${className}`}>
            {children}
        </label>
    );
}

const styles = StyleSheet.create({});