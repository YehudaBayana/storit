# Button Component

The `Button` component is used to trigger actions or navigation. It supports multiple visual variants, sizes, and optional left/right icons using `react-icons`.

## Import

```tsx
import { Button } from "@/components/ui";
```

## Usage Example

```tsx
import { Button } from "@/components/ui";
import { IoAdd } from "react-icons/io5";

export default function MyComponent() {
  return (
    <Button leftIcon="{IoAdd}" onClick="{()"> console.log('Clicked')} size="md" variant="primary">
      Create File
    </Button>
  );
}
```

## Props

| Prop        | Type                                               | Default     | Description                                |
| :---------- | :------------------------------------------------- | :---------- | :----------------------------------------- |
| `variant`   | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style of the button.                |
| `size`      | `'sm' \| 'md' \| 'lg'`                             | `'md'`      | Padding and font sizing.                   |
| `leftIcon`  | `IconType`                                         | `undefined` | Optional icon rendered before text.        |
| `rightIcon` | `IconType`                                         | `undefined` | Optional icon rendered after text.         |
| `testId`    | `string`                                           | `'button'`  | Data-testid attribute for testing drivers. |
