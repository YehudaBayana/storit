import { screen } from "@testing-library/react";

export class ImageDriver {
  private testId: string;

  constructor(testId: string = "image") {
    this.testId = testId;
  }

  private getElement(): HTMLElement {
    return screen.getByTestId(this.testId);
  }

  public get imgElement(): HTMLImageElement {
    return this.getElement().querySelector("img") as HTMLImageElement;
  }

  public get alt(): string {
    return this.imgElement?.alt || "";
  }

  public exists(): boolean {
    return screen.queryByTestId(this.testId) !== null;
  }
}
