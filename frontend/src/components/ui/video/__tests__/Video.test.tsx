import React from "react";
import { render } from "@testing-library/react";
import { Video } from "../Video";
import { VideoDriver } from "./Video.driver";

describe("Video Component", () => {
  it("renders successfully with the correct source", () => {
    render(<Video src="/assets/demo.mp4" />);
    const driver = new VideoDriver();

    expect(driver.exists()).toBe(true);
    expect(driver.getSource()).toBe("/assets/demo.mp4");
  });

  it("renders with controls by default", () => {
    render(<Video src="/assets/demo.mp4" />);
    const driver = new VideoDriver();

    expect(driver.hasControls()).toBe(true);
  });

  it("applies muted property when provided", () => {
    render(<Video src="/assets/demo.mp4" muted />);
    const driver = new VideoDriver();

    expect(driver.isMuted()).toBe(true);
  });
});
