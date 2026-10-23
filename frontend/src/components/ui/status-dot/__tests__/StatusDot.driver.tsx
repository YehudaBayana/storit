import { render, RenderResult } from "@testing-library/react";
import StatusDot, { StatusDotProps } from "../StatusDot";
import { getByDataHook, queryByDataHook } from "@/__tests__/testUtils";

export class StatusDotDriver {
  private renderResult: RenderResult | null = null;
  private readonly defaultDataHook = "test-status-dot";

  render(props: StatusDotProps = {}): this {
    const dataHook = props.dataHook ?? this.defaultDataHook;
    this.renderResult = render(<StatusDot {...props} dataHook={dataHook} />);
    return this;
  }

  private getRoot(dataHook = this.defaultDataHook): HTMLElement {
    if (!this.renderResult)
      throw new Error("StatusDotDriver: render() must be called before querying");
    return getByDataHook(this.renderResult.container, dataHook);
  }

  exists(dataHook = this.defaultDataHook): boolean {
    if (!this.renderResult) return false;
    return queryByDataHook(this.renderResult.container, dataHook) !== null;
  }

  getClassName(dataHook = this.defaultDataHook): string {
    return this.getRoot(dataHook).className;
  }
}
