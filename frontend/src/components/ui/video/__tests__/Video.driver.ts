import { screen } from '@testing-library/react';

export class VideoDriver {
  private testId: string;

  constructor(testId: string = 'video-component') {
    this.testId = testId;
  }

  exists(): boolean {
    return this.getElement() !== null;
  }

  getSource(): string | null {
    const el = this.getElement();
    return el ? el.getAttribute('src') : null;
  }

  hasControls(): boolean {
    const el = this.getElement();
    return el ? el.hasAttribute('controls') : false;
  }

  isMuted(): boolean {
    const el = this.getElement();
    return el ? el.hasAttribute('muted') : false;
  }

  private getElement(): HTMLVideoElement | null {
    return screen.queryByTestId(this.testId) as HTMLVideoElement | null;
  }
}
