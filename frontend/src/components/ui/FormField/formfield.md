# FormField

A structural component that pairs a form control (like Input) with a label and error text.

## Import

    import { FormField } from '@/components/ui/FormField/FormField';

## Usage

    <FormField label="Password" error="Password must be at least 8 characters">
      <Input type="password" hasError={true} />
    </FormField>

## Props

| Prop  | Type            | Default | Description                               |
|-------|-----------------|---------|-------------------------------------------|
| label | string          | -       | The text displayed above the input        |
| error | string          | -       | Validation message displayed below input  |
