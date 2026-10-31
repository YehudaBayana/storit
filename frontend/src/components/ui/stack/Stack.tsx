import React from "react";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  gap?: "none" | "sm" | "md" | "lg";
}

// Stack is a layout wrapper that helps organize elements side-by-side or top-to-bottom.
export const Stack: React.FC<StackProps> = ({
  direction = "col",
  gap = "md",
  className = "",
  children,
  ...props
}) => {
  const directionClasses = direction === "col" ? "flex-col" : "flex-row";

  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div className={`flex ${directionClasses} ${gapClasses[gap]} ${className}`} {...props}>
      {children}
    </div>
  );
};
