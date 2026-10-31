import { screen, fireEvent } from "@testing-library/react";

export class ModalDriver {
  private testId: string;

  constructor(testId: string = "modal") {
    this.testId = testId;
  }

  private getElement(): HTMLElement {
    return screen.getByTestId(this.testId);
  }

  public clickClose(): this {
    fireEvent.click(screen.getByTestId(`${this.testId}-close-btn`));
    return this;
  }

  public clickBackdrop(): this {
    fireEvent.click(screen.getByTestId(`${this.testId}-backdrop`));
    return this;
  }

  public get text(): string {
    return this.getElement().textContent || "";
  }

  public exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }
}
