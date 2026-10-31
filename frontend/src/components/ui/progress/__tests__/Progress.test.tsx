import React from "react";
import { render } from "@testing-library/react";
import { Progress } from "../Progress";
import { ProgressDriver } from "./Progress.driver";

describe("Progress Component", () => {
  it("should render correct progress value", () => {
    render(<Progress testId="storage-progress" value={65} />);
    const driver = new ProgressDriver("storage-progress");

    expect(driver.exists()).toBe(true);
    expect(driver.value).toBe(65);
  });
});
