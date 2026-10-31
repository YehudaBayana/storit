import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Input, InputProps } from "../Input";

export class InputDriver {
  render(props: InputProps) {
    render(<Input data-testid="input-component" {...props} />);
    return this;
  }

  get element() {
    return screen.getByTestId("input-component") as HTMLInputElement;
  }

  type(text: string) {
    fireEvent.change(this.element, { target: { value: text } });
    return this;
  }

  get value() {
    return this.element.value;
  }
}
