import React from "react";

export interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  testId?: string;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  as: Component = "h2",
  size = "lg",
  children,
  testId = "heading",
  className = "",
}) => {
  const sizes = {
    sm: "text-lg font-semibold text-gray-900",
    md: "text-xl font-bold text-gray-900",
    lg: "text-2xl font-bold text-gray-900",
    xl: "text-3xl font-extrabold text-gray-900",
  };

  return (
    <Component data-testid={testId} className={`${sizes[size]} ${className}`}>
      {children}
    </Component>
  );
};
