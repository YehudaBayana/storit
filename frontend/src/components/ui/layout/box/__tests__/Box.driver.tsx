import React from "react";
import { render, RenderResult } from "@testing-library/react";
import Box from "../Box";
import { getByDataHook } from "@/__tests__/testUtils";

export interface BoxDriverProps {
  dataHook?: string;
  as?: "div" | "section" | "article";
  p?: number;
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  inset?: "0" | "x-0" | "y-0";
  z?: "0" | "10" | "20" | "30" | "40" | "50";
  overflow?: "visible" | "hidden" | "auto" | "scroll";
  overflowY?: "visible" | "hidden" | "auto" | "scroll";
  aspect?: "video" | "square";
  group?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export class BoxDriver {
  private renderResult: RenderResult | null = null;
  private readonly defaultDataHook = "test-box";

  render(props: BoxDriverProps = {}): this {
    const dataHook = props.dataHook ?? this.defaultDataHook;
    this.renderResult = render(
      <Box {...props} dataHook={dataHook}>
        {props.children ?? "Content"}
      </Box>,
    );
    return this;
  }

  private getRoot(dataHook = this.defaultDataHook): HTMLElement {
    if (!this.renderResult) throw new Error("BoxDriver: render() must be called before querying");
    return getByDataHook(this.renderResult.container, dataHook);
  }

  getTagName(dataHook = this.defaultDataHook): string {
    return this.getRoot(dataHook).tagName;
  }

  getClassName(dataHook = this.defaultDataHook): string {
    return this.getRoot(dataHook).className;
  }
}
