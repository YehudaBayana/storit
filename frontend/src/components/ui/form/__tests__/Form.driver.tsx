import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Form, FormProps } from "../Form";

export class FormDriver {
  render(props: FormProps) {
    render(<Form data-testid="form-component" {...props} />);
    return this;
  }

  get element() {
    return screen.getByTestId("form-component");
  }

  submit() {
    fireEvent.submit(this.element);
    return this;
  }
}
