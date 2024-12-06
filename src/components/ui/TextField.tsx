import * as React from "react";
import { StyleSheet } from "react-nativescript";

interface TextFieldProps {
    value: string;
    onTextChange: (value: string) => void;
    placeholder?: string;
    secure?: boolean;
    keyboardType?: "text" | "email" | "number" | "phone";
    className?: string;
    error?: string;
}

export function TextField({
    value,
    onTextChange,
    placeholder,
    secure = false,
    keyboardType = "text",
    className = "",
    error
}: TextFieldProps) {
    return (
        <stackLayout>
            <textField
                className={`p-4 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
                hint={placeholder}
                text={value}
                secure={secure}
                keyboardType={keyboardType}
                onTextChange={(e) => onTextChange(e.value)}
            />
            {error && (
                <label className="text-red-500 text-sm mt-1">
                    {error}
                </label>
            )}
        </stackLayout>
    );
}

const styles = StyleSheet.create({});