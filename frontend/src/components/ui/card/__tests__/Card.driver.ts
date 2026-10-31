import { screen, fireEvent } from "@testing-library/react";

export class CardDriver {
  private testId: string;

  constructor(testId: string = "card") {
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

  public exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }
}
