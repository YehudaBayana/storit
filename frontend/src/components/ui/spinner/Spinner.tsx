import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  testId?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  testId = "spinner",
  className = "",
}) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      role="status"
      data-testid={testId}
      className={`inline-block animate-spin rounded-full border-brand-500 border-t-transparent ${sizes[size]} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
