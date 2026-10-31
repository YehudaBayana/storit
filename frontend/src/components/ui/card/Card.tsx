import React from "react";
import { Box, BoxProps } from "../box/Box";

export interface CardProps extends BoxProps {
  variant?: "default" | "bordered" | "interactive";
}

export const Card: React.FC<CardProps> = ({
  variant = "default",
  className = "",
  testId = "card",
  children,
  ...props
}) => {
  const baseStyles = "bg-white rounded-xl overflow-hidden transition-all";

  const variants = {
    default: "shadow-sm border border-gray-100",
    bordered: "border border-gray-200",
    interactive:
      "shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 cursor-pointer",
  };

  return (
    <Box testId={testId} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Box>
  );
};
