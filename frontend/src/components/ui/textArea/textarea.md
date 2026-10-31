# TextArea

A minimalist, responsive multi-line text input field supporting labels and error states.

## Import

    import { TextArea } from "@/components/ui/textarea/TextArea";

## Usage Example

    export default function Form() {
      return (
        <TextArea
          label="Bio"
          placeholder="Tell us about yourself..."
          rows={4}
        />
      );
    }

## Props

| Prop       | Type                     | Default      | Description                                 |
| :--------- | :----------------------- | :----------- | :------------------------------------------ |
| `label`    | `string`                 | `undefined`  | Optional label displayed above the textarea |
| `error`    | `string`                 | `undefined`  | Error message displayed below the textarea  |
| `testId`   | `string`                 | `'textarea'` | Data-testid for DOM targeting               |
| `...props` | `TextareaHTMLAttributes` | -            | Standard HTML textarea attributes           |
