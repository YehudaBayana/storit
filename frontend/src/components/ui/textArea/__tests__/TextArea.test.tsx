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
