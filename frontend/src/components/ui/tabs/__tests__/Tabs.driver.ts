import { screen, fireEvent } from "@testing-library/react";

export class TabsDriver {
  private testId: string;

  constructor(testId: string = "tabs") {
    this.testId = testId;
  }

  public clickTab(tabId: string): this {
    fireEvent.click(screen.getByTestId(`${this.testId}-tab-${tabId}`));
    return this;
  }

  public get activeContent(): string {
    return screen.getByTestId(`${this.testId}-content`).textContent || "";
  }

  public exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }
}
