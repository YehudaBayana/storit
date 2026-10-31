import { render, screen } from '@testing-library/react';
import React from 'react';
import { Stack, StackProps } from '../Stack';

// The Driver pattern encapsulates DOM queries to keep our tests clean and readable.
export class StackDriver {
  render(props: StackProps) {
    render(<Stack data-testid="stack-component" {...props} />);
    return this;
  }

  get element() {
    return screen.getByTestId('stack-component');
  }

  hasClass(className: string) {
    return this.element.classList.contains(className);
  }
}
