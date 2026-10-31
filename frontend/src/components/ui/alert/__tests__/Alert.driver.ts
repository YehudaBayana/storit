import { screen, fireEvent } from '@testing-library/react';

export class AlertDriver {
  private testId: string;

  constructor(testId: string = 'alert-component') {
    this.testId = testId;
  }

  exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }

  getTitle(): string | null {
    const titleElement = screen.queryByTestId(`${this.testId}-title`);
    return titleElement ? titleElement.textContent : null;
  }

  getContent(): string | null {
    const contentElement = screen.queryByTestId(`${this.testId}-content`);
    return contentElement ? contentElement.textContent : null;
  }

  clickClose(): void {
    const closeButton = screen.queryByTestId(`${this.testId}-close`);
    if (closeButton) {
      fireEvent.click(closeButton);
    }
  }
}
