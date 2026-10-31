import { screen } from "@testing-library/react";

export class VideoDriver {
  private testId: string;

  constructor(testId: string = "video-component") {
    this.testId = testId;
  }

  exists(): boolean {
    return this.getElement() !== null;
  }

  getSource(): string | null {
    const el = this.getElement();
    // Use getAttribute to get the exact relative path ("/..."), not the absolute URL
    return el ? el.getAttribute("src") : null;
  }

  hasControls(): boolean {
    const el = this.getElement();
    if (!el) return false;

    // Checks both the property set by React and the HTML attribute
    return el.controls || el.hasAttribute("controls");
  }

  isMuted(): boolean {
    const el = this.getElement();
    return el ? el.muted : false;
  }

  private getElement(): HTMLVideoElement | null {
    return screen.queryByTestId(this.testId) as HTMLVideoElement | null;
  }
}
