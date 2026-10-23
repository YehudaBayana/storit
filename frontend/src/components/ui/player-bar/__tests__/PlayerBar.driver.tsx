import { render, RenderResult } from "@testing-library/react";
import PlayerBar, { PlayerBarProps } from "../PlayerBar";
import { getByDataHook, queryByDataHook } from "@/__tests__/testUtils";

export class PlayerBarDriver {
  private renderResult: RenderResult | null = null;
  private readonly defaultDataHook = "test-player-bar";

  render(props: PlayerBarProps = { children: null }): this {
    const dataHook = props.dataHook ?? this.defaultDataHook;
    this.renderResult = render(
      <PlayerBar {...props} dataHook={dataHook}>
        {props.children ?? <div>Player Content</div>}
      </PlayerBar>,
    );
    return this;
  }

  private getRoot(dataHook = this.defaultDataHook): HTMLElement {
    if (!this.renderResult)
      throw new Error("PlayerBarDriver: render() must be called before querying");
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
