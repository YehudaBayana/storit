import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

export interface LinkProps extends NextLinkProps {
  children: React.ReactNode;
  variant?: "default" | "subtle" | "brand";
  testId?: string;
  className?: string;
  target?: string;
  rel?: string;
}

export const Link: React.FC<LinkProps> = ({
  children,
  variant = "default",
  testId = "link",
  className = "",
  ...props
}) => {
  const variants = {
    default: "text-brand-600 hover:text-brand-700 font-medium underline underline-offset-4",
    subtle: "text-gray-600 hover:text-gray-900 transition-colors",
    brand: "text-brand-dark hover:text-brand-500 font-semibold transition-colors",
  };

  return (
    <NextLink data-testid={testId} className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </NextLink>
  );
};
