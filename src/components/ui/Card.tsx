import * as React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow-md ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}