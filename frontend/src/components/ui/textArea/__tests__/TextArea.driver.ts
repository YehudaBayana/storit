import { screen, fireEvent } from "@testing-library/react";

export class TextAreaDriver {
  private testId: string;

  constructor(testId: string = "textarea") {
    this.testId = testId;
  }

  get element(): HTMLTextAreaElement {
    return screen.getByTestId(this.testId) as HTMLTextAreaElement;
  }

  get value(): string {
    return this.element.value;
  }

  get errorText(): string | null {
    const errorEl = screen.queryByTestId(`${this.testId}-error`);
    return errorEl ? errorEl.textContent : null;
  }

  change(value: string): void {
    fireEvent.change(this.element, { target: { value } });
  }

  exists(): boolean {
    return !!screen.queryByTestId(this.testId);
  }

  isDisabled(): boolean {
    return this.element.disabled;
  }
}
