# Text Component

The `Text` component is used for standard body copy, paragraphs, and helper labels with consistent color variants and sizes.

## Import

```tsx
import { Text } from "@/components/ui";
```

## Usage Example

```tsx
import { Text } from "@/components/ui";

export default function MyComponent() {
  return (
    <Text size="sm" variant="muted">
      500 GB of 900 GB used
    </Text>
  );
}
```

## Props

| Prop      | Type                               | Default     | Description                                |
| :-------- | :--------------------------------- | :---------- | :----------------------------------------- |
| `size`    | `'xs' \| 'sm' \| 'md' \| 'lg'`     | `'md'`      | Font size scale.                           |
| `variant` | `'default' \| 'muted' \| 'danger'` | `'default'` | Text color token.                          |
| `testId`  | `string`                           | `'text'`    | Data-testid attribute for testing drivers. |
