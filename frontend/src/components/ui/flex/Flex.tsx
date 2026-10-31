import React from "react";
import { Box, BoxProps } from "../box/Box";

export interface FlexProps extends BoxProps {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

export const Flex: React.FC<FlexProps> = ({
  direction = "row",
  align = "stretch",
  justify = "start",
  wrap = "nowrap",
  gap = "none",
  className = "",
  testId = "flex",
  ...props
}) => {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col",
    "row-reverse": "flex-row-reverse",
    "col-reverse": "flex-col-reverse",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const wrapClasses = {
    wrap: "flex-wrap",
    nowrap: "flex-nowrap",
    "wrap-reverse": "flex-wrap-reverse",
  };

  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const combinedClasses = [
    "flex",
    directionClasses[direction],
    alignClasses[align],
    justifyClasses[justify],
    wrapClasses[wrap],
    gapClasses[gap],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Box testId={testId} className={combinedClasses} {...props} />;
};
