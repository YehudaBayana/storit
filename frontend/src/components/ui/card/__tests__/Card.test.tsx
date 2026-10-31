import React from "react";
import { render } from "@testing-library/react";
import { Card } from "../Card";
import { CardDriver } from "./Card.driver";

describe("Card Component", () => {
  it("should render children content properly", () => {
    render(
      <Card testId="file-card">
        <p>Card Content</p>
      </Card>,
    );

    const driver = new CardDriver("file-card");
    expect(driver.exists()).toBe(true);
    expect(driver.text).toContain("Card Content");
  });
});
