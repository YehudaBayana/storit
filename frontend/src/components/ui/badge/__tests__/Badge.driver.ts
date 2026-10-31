import { screen } from "@testing-library/react";

export class BadgeDriver {
  private testId: string;

  constructor(testId: string = "badge") {
    this.testId = testId;
  }

  private getElement(): HTMLElement {
    return screen.getByTestId(this.testId);
  }

  public get text(): string {
    return this.getElement().textContent || "";
  }

  public exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }
}
