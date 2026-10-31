import React from "react";

export interface BadgeProps {
  variant?: "success" | "warning" | "error" | "neutral" | "brand";
  size?: "sm" | "md";
  children: React.ReactNode;
  testId?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  children,
  testId = "badge",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";

  const variants = {
    success: "bg-brand-50 text-brand-600 border border-brand-500/30",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-red-50 text-red-700 border border-red-200",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200",
    brand: "bg-brand-dark text-white",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      data-testid={testId}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
