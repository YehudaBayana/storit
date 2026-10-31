import React from "react";
import { Box, BoxProps } from "../box/Box";

export interface GridProps extends BoxProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

export const Grid: React.FC<GridProps> = ({
  cols = 1,
  gap = "md",
  className = "",
  testId = "grid",
  ...props
}) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
  };

  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const combinedClasses = ["grid", colClasses[cols], gapClasses[gap], className]
    .filter(Boolean)
    .join(" ");

  return <Box testId={testId} className={combinedClasses} {...props} />;
};
