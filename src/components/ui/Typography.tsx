import * as React from "react";

interface TypographyProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  className?: string;
}

export function Typography({ children, variant = "body", className = "" }: TypographyProps) {
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

  switch (variant) {
    case "h1":
      return <h1 className={`${getVariantClass()} ${className}`}>{children}</h1>;
    case "h2":
      return <h2 className={`${getVariantClass()} ${className}`}>{children}</h2>;
    case "h3":
      return <h3 className={`${getVariantClass()} ${className}`}>{children}</h3>;
    case "caption":
      return <p className={`${getVariantClass()} ${className}`}>{children}</p>;
    default:
      return <p className={`${getVariantClass()} ${className}`}>{children}</p>;
  }
}