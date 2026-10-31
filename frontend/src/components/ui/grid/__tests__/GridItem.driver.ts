import { screen } from "@testing-library/react";

export class GridItemDriver {
  private testId: string;

  constructor(testId: string = "grid-item") {
    this.testId = testId;
  }

  get element(): HTMLDivElement {
    return screen.getByTestId(this.testId) as HTMLDivElement;
  }

  get text(): string | null {
    return this.element.textContent;
  }

  hasClass(className: string): boolean {
    return this.element.classList.contains(className);
  }

  exists(): boolean {
    return !!screen.queryByTestId(this.testId);
  }
}
