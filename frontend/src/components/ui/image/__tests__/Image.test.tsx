import React from "react";
import { render } from "@testing-library/react";
import { Image } from "../Image";
import { ImageDriver } from "./Image.driver";

describe("Image Component", () => {
  it("should render next/image with correct alt text", () => {
    render(
      <Image testId="user-avatar" src="/avatar.png" alt="User Avatar" width={40} height={40} />,
    );

    const driver = new ImageDriver("user-avatar");
    expect(driver.exists()).toBe(true);
    expect(driver.alt).toBe("User Avatar");
  });
});
