import { render, RenderResult } from "@testing-library/react";
import Video, { VideoProps } from "../Video";
import { getByDataHook, queryByDataHook } from "@/__tests__/testUtils";

export class VideoDriver {
  private renderResult: RenderResult | null = null;
  private readonly defaultDataHook = "test-video";

  render(props: VideoProps = {}): this {
    const dataHook = props.dataHook ?? this.defaultDataHook;
    this.renderResult = render(<Video {...props} dataHook={dataHook} />);
    return this;
  }

  private getRoot(dataHook = this.defaultDataHook): HTMLVideoElement {
    if (!this.renderResult) throw new Error("VideoDriver: render() must be called before querying");
    return getByDataHook(this.renderResult.container, dataHook) as HTMLVideoElement;
  }

  exists(dataHook = this.defaultDataHook): boolean {
    if (!this.renderResult) return false;
    return queryByDataHook(this.renderResult.container, dataHook) !== null;
  }

  getClassName(dataHook = this.defaultDataHook): string {
    return this.getRoot(dataHook).className;
  }

  getSrc(dataHook = this.defaultDataHook): string {
    return this.getRoot(dataHook).getAttribute("src") ?? "";
  }
}
