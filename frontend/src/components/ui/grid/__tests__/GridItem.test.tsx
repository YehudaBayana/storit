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
