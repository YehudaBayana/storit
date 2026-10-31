import { screen, fireEvent } from "@testing-library/react";

export class LinkDriver {
  private testId: string;

  constructor(testId: string = "link") {
    this.testId = testId;
  }

  private getElement(): HTMLElement {
    return screen.getByTestId(this.testId);
  }

  public click(): this {
    fireEvent.click(this.getElement());
    return this;
  }

  public get text(): string {
    return this.getElement().textContent || "";
  }

  public get href(): string {
    return this.getElement().getAttribute("href") || "";
  }

  public exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }
}
