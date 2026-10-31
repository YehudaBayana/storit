import { screen, fireEvent } from "@testing-library/react";

export class SidebarDriver {
  private testId: string;

  constructor(testId: string = "sidebar") {
    this.testId = testId;
  }

  private getElement(): HTMLElement {
    return screen.getByTestId(this.testId);
  }

  public clickItem(itemId: string): this {
    const item = screen.getByTestId(`${this.testId}-item-${itemId}`);
    fireEvent.click(item);
    return this;
  }

  public isItemActive(itemId: string): boolean {
    const item = screen.getByTestId(`${this.testId}-item-${itemId}`);
    return item.className.includes("bg-brand-50");
  }

  public exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }
}
