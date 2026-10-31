import React from "react";

export interface TextProps {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "muted" | "danger";
  children: React.ReactNode;
  testId?: string;
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  size = "md",
  variant = "default",
  children,
  testId = "text",
  className = "",
}) => {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const variants = {
    default: "text-gray-700",
    muted: "text-gray-500",
    danger: "text-red-600",
  };

  return (
    <p data-testid={testId} className={`${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </p>
  );
};
