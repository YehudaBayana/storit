import { render, screen } from "@testing-library/react";
import React from "react";

export class EmptyStateDriver {
  render(component: React.ReactElement) {
    render(component);
    return this;
  }

  exists() {
    return screen.queryByRole("heading") !== null;
  }

  getTitleText() {
    return screen.getByRole("heading")?.textContent;
  }

  getDescriptionText() {
    return screen.queryByTestId("empty-state-description")?.textContent;
  }

  hasIcon() {
    return screen.queryByTestId("empty-state-icon") !== null;
  }

  hasAction() {
    return screen.queryByTestId("empty-state-action") !== null;
  }
}
