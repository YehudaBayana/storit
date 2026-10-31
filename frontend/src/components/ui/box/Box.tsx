import React from "react";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  testId?: string;
  className?: string;
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ as: Component = "div", testId = "box", className = "", children, ...props }, ref) => {
    return (
      <Component ref={ref} data-testid={testId} className={className} {...props}>
        {children}
      </Component>
    );
  },
);

Box.displayName = "Box";
