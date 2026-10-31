import React from "react";

export interface ProgressProps {
  value: number; // 0 to 100
  size?: "sm" | "md" | "lg";
  testId?: string;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  size = "md",
  testId = "progress",
  className = "",
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div
      data-testid={testId}
      className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizes[size]} ${className}`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="bg-brand-500 h-full transition-all duration-300 rounded-full"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};
