import React from "react";

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  testId?: string;
}

export const GridItem: React.FC<GridItemProps> = ({
  colSpan,
  rowSpan,
  className = "",
  testId = "grid-item",
  children,
  ...props
}) => {
  const colClasses: Record<number, string> = {
    1: "col-span-1", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4",
    5: "col-span-5", 6: "col-span-6", 7: "col-span-7", 8: "col-span-8",
    9: "col-span-9", 10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
  };

  const rowClasses: Record<number, string> = {
    1: "row-span-1", 2: "row-span-2", 3: "row-span-3",
    4: "row-span-4", 5: "row-span-5", 6: "row-span-6",
  };

  const combinedClasses = [
    colSpan ? colClasses[colSpan] : "",
    rowSpan ? rowClasses[rowSpan] : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div data-testid={testId} className={combinedClasses} {...props}>
      {children}
    </div>
  );
};
