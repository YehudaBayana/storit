import { render, RenderResult } from "@testing-library/react";
import Audio, { AudioProps } from "../Audio";
import { getByDataHook, queryByDataHook } from "@/__tests__/testUtils";

export class AudioDriver {
  private renderResult: RenderResult | null = null;
  private readonly defaultDataHook = "test-audio";

  render(props: AudioProps = {}): this {
    const dataHook = props.dataHook ?? this.defaultDataHook;
    this.renderResult = render(<Audio {...props} dataHook={dataHook} />);
    return this;
  }

  private getRoot(dataHook = this.defaultDataHook): HTMLAudioElement {
    if (!this.renderResult) throw new Error("AudioDriver: render() must be called before querying");
    return getByDataHook(this.renderResult.container, dataHook) as HTMLAudioElement;
  }

  exists(dataHook = this.defaultDataHook): boolean {
    if (!this.renderResult) return false;
    return queryByDataHook(this.renderResult.container, dataHook) !== null;
  }

  getSrc(dataHook = this.defaultDataHook): string {
    return this.getRoot(dataHook).getAttribute("src") ?? "";
  }
}
