import { screen } from "@testing-library/react";

export class ProgressDriver {
  private testId: string;

  constructor(testId: string = "progress") {
    this.testId = testId;
  }

  private getElement(): HTMLElement {
    return screen.getByTestId(this.testId);
  }

  public get value(): number {
    const el = this.getElement();
    return Number(el.getAttribute("aria-valuenow"));
  }

  public exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }
}
