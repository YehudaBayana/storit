import { render } from "@testing-library/react";
import { Button } from "../Button";
import { ButtonDriver } from "./Button.driver";

describe("Button Component", () => {
  it("should render text correctly and handle user clicks", () => {
    const handleClick = jest.fn();
    render(
      <Button testId="create-btn" onClick={handleClick}>
        Create File
      </Button>,
    );

    const driver = new ButtonDriver("create-btn");

    expect(driver.exists()).toBe(true);
    expect(driver.text).toContain("Create File");

    driver.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should handle disabled state properly", () => {
    render(
      <Button testId="disabled-btn" disabled>
        Upload
      </Button>,
    );

    const driver = new ButtonDriver("disabled-btn");
    expect(driver.isDisabled).toBe(true);
  });
});
