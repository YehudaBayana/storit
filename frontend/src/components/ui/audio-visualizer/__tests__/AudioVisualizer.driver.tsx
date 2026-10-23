import { render, RenderResult } from "@testing-library/react";
import AudioVisualizer, { AudioVisualizerProps } from "../AudioVisualizer";
import { getByDataHook, queryByDataHook } from "@/__tests__/testUtils";

export class AudioVisualizerDriver {
  private renderResult: RenderResult | null = null;
  private readonly defaultDataHook = "test-audio-visualizer";

  render(props: AudioVisualizerProps = {}): this {
    const dataHook = props.dataHook ?? this.defaultDataHook;
    this.renderResult = render(<AudioVisualizer {...props} dataHook={dataHook} />);
    return this;
  }

  private getRoot(dataHook = this.defaultDataHook): HTMLElement {
    if (!this.renderResult)
      throw new Error("AudioVisualizerDriver: render() must be called before querying");
    return getByDataHook(this.renderResult.container, dataHook);
  }

  exists(dataHook = this.defaultDataHook): boolean {
    if (!this.renderResult) return false;
    return queryByDataHook(this.renderResult.container, dataHook) !== null;
  }

  getClassName(dataHook = this.defaultDataHook): string {
    return this.getRoot(dataHook).className;
  }

  getAccessibleLabel(dataHook = this.defaultDataHook): string | null {
    return this.getRoot(dataHook).getAttribute("aria-label");
  }
}
