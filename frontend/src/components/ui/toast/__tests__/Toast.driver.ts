import { screen, fireEvent } from "@testing-library/react";

export class ToastDriver {
  private testId: string;

  constructor(testId: string = "toast") {
    this.testId = testId;
  }

  private getElement(): HTMLElement {
    return screen.getByTestId(this.testId);
  }

  public clickClose(): this {
    fireEvent.click(screen.getByTestId(`${this.testId}-close`));
    return this;
  }

  public get text(): string {
    return this.getElement().textContent || "";
  }

  public exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }
}
