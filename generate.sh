#!/bin/bash

# Create the necessary directories
mkdir -p frontend/src/components/ui/textarea/__tests__
mkdir -p frontend/src/components/ui/grid/__tests__

# ==========================================
# 1. TextArea Component
# ==========================================

cat << 'EOF' > frontend/src/components/ui/textarea/TextArea.tsx
import React from "react";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  testId?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = "", testId = "textarea", ...props }, ref) => {
    return (
      <div className="flex flex-col w-full" data-testid={`${testId}-container`}>
        {label && (
          <label htmlFor={props.id} className="mb-1 text-sm font-medium text-brand-dark">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          data-testid={testId}
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-brand-dark bg-white transition-colors ${
            error ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
          } ${props.disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : ""} ${className}`}
          {...props}
        />
        {error && (
          <span data-testid={`${testId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
EOF

cat << 'EOF' > frontend/src/components/ui/textarea/__tests__/TextArea.driver.ts
import { screen, fireEvent } from "@testing-library/react";

export class TextAreaDriver {
  private testId: string;

  constructor(testId: string = "textarea") {
    this.testId = testId;
  }

  get element(): HTMLTextAreaElement {
    return screen.getByTestId(this.testId) as HTMLTextAreaElement;
  }

  get value(): string {
    return this.element.value;
  }

  get errorText(): string | null {
    const errorEl = screen.queryByTestId(`${this.testId}-error`);
    return errorEl ? errorEl.textContent : null;
  }

  change(value: string): void {
    fireEvent.change(this.element, { target: { value } });
  }

  exists(): boolean {
    return !!screen.queryByTestId(this.testId);
  }

  isDisabled(): boolean {
    return this.element.disabled;
  }
}
EOF

cat << 'EOF' > frontend/src/components/ui/textarea/__tests__/TextArea.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import { TextArea } from "../TextArea";
import { TextAreaDriver } from "./TextArea.driver";

describe("TextArea Component", () => {
  let driver: TextAreaDriver;

  beforeEach(() => {
    driver = new TextAreaDriver();
  });

  it("renders correctly and accepts input", () => {
    render(<TextArea placeholder="Enter text..." />);
    
    expect(driver.exists()).toBe(true);
    
    driver.change("Hello World");
    expect(driver.value).toBe("Hello World");
  });

  it("displays an error message when provided", () => {
    render(<TextArea error="This field is required" />);
    
    expect(driver.errorText).toBe("This field is required");
  });

  it("is disabled when disabled prop is true", () => {
    render(<TextArea disabled />);
    
    expect(driver.isDisabled()).toBe(true);
  });
});
EOF

cat << 'EOF' > frontend/src/components/ui/textarea/textarea.md
# TextArea

A minimalist, responsive multi-line text input field supporting labels and error states.

## Import

    import { TextArea } from "@/components/ui/textarea/TextArea";

## Usage Example

    export default function Form() {
      return (
        <TextArea 
          label="Bio"
          placeholder="Tell us about yourself..."
          rows={4}
        />
      );
    }

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | Optional label displayed above the textarea |
| `error` | `string` | `undefined` | Error message displayed below the textarea |
| `testId` | `string` | `'textarea'` | Data-testid for DOM targeting |
| `...props` | `TextareaHTMLAttributes` | - | Standard HTML textarea attributes |
EOF

# ==========================================
# 2. GridItem Component (in existing Grid folder)
# ==========================================

cat << 'EOF' > frontend/src/components/ui/grid/GridItem.tsx
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
EOF

cat << 'EOF' > frontend/src/components/ui/grid/__tests__/GridItem.driver.ts
import { screen } from "@testing-library/react";

export class GridItemDriver {
  private testId: string;

  constructor(testId: string = "grid-item") {
    this.testId = testId;
  }

  get element(): HTMLDivElement {
    return screen.getByTestId(this.testId) as HTMLDivElement;
  }

  get text(): string | null {
    return this.element.textContent;
  }

  hasClass(className: string): boolean {
    return this.element.classList.contains(className);
  }

  exists(): boolean {
    return !!screen.queryByTestId(this.testId);
  }
}
EOF

cat << 'EOF' > frontend/src/components/ui/grid/__tests__/GridItem.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import { GridItem } from "../GridItem";
import { GridItemDriver } from "./GridItem.driver";

describe("GridItem Component", () => {
  let driver: GridItemDriver;

  beforeEach(() => {
    driver = new GridItemDriver();
  });

  it("renders correctly with children", () => {
    render(<GridItem>Content block</GridItem>);
    
    expect(driver.exists()).toBe(true);
    expect(driver.text).toBe("Content block");
  });

  it("applies correct column span classes", () => {
    render(<GridItem colSpan={4} />);
    
    expect(driver.hasClass("col-span-4")).toBe(true);
  });

  it("applies correct row span classes", () => {
    render(<GridItem rowSpan={2} />);
    
    expect(driver.hasClass("row-span-2")).toBe(true);
  });

  it("merges custom classes correctly", () => {
    render(<GridItem className="bg-brand-500" colSpan={6} />);
    
    expect(driver.hasClass("col-span-6")).toBe(true);
    expect(driver.hasClass("bg-brand-500")).toBe(true);
  });
});
EOF

cat << 'EOF' > frontend/src/components/ui/grid/grid-item.md
# GridItem

A layout component designed to be used as a child of the `Grid` component. It handles specific span definitions for rows and columns.

## Import

    import { GridItem } from "@/components/ui/grid/GridItem";

## Usage Example

    import { Grid } from "@/components/ui/grid/Grid";
    import { GridItem } from "@/components/ui/grid/GridItem";

    export default function Layout() {
      return (
        <Grid cols={12} gap="md">
          <GridItem colSpan={8} className="bg-brand-500 text-white p-4">
            Main Content
          </GridItem>
          <GridItem colSpan={4} className="bg-gray-100 text-brand-dark p-4">
            Sidebar
          </GridItem>
        </Grid>
      );
    }

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `colSpan` | `1 \| 2 ... \| 12` | `undefined` | Number of columns the item spans |
| `rowSpan` | `1 \| 2 ... \| 6` | `undefined` | Number of rows the item spans |
| `testId` | `string` | `'grid-item'` | Data-testid for DOM targeting |
| `...props` | `HTMLAttributes` | - | Standard HTML div attributes |
EOF