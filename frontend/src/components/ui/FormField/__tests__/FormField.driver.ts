import { render, screen } from '@testing-library/react';
import React from 'react';
import { FormField, FormFieldProps } from '../FormField';

export class FormFieldDriver {
  render(props: FormFieldProps) {
    render(<FormField {...props} />);
    return this;
  }

  get labelText() {
    return screen.queryByText((content, element) => element?.tagName.toLowerCase() === 'label')?.textContent;
  }

  get errorText() {
    return screen.queryByRole('alert')?.textContent;
  }
}
