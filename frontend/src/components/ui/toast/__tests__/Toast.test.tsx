import React from "react";
import { render } from "@testing-library/react";
import { Toast } from "../Toast";
import { ToastDriver } from "./Toast.driver";

describe("Toast Component", () => {
  it("should display title and message, and support close action", () => {
    const handleClose = jest.fn();
    render(
      <Toast
        testId="file-toast"
        title="File Uploaded"
        message="Your file has been uploaded successfully."
        onClose={handleClose}
      />,
    );

    const driver = new ToastDriver("file-toast");
    expect(driver.exists()).toBe(true);
    expect(driver.text).toContain("File Uploaded");
    expect(driver.text).toContain("Your file has been uploaded successfully.");

    driver.clickClose();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
