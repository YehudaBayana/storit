import React from "react";
import { render } from "@testing-library/react";
import { Link } from "../Link";
import { LinkDriver } from "./Link.driver";

describe("Link Component", () => {
  it("should render link text and correct href attribute", () => {
    render(
      <Link testId="nav-link" href="/dashboard">
        Dashboard
      </Link>,
    );

    const driver = new LinkDriver("nav-link");
    expect(driver.exists()).toBe(true);
    expect(driver.text).toBe("Dashboard");
    expect(driver.href).toBe("/dashboard");
  });
});
