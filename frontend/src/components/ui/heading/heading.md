# Heading Component

The `Heading` component renders semantic title elements (`h1` through `h6`) with standardized font weights and sizes across the application.

## Import

```tsx
import { Heading } from "@/components/ui";
```

## Usage Example

```tsx
import { Heading } from "@/components/ui";

export default function MyComponent() {
  return (
    <Heading as="h1" size="xl">
      All Files & Projects
    </Heading>
  );
}
```

## Props

| Prop     | Type                                           | Default     | Description                                |
| :------- | :--------------------------------------------- | :---------- | :----------------------------------------- |
| `as`     | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h2'`      | Semantic HTML heading tag to render.       |
| `size`   | `'sm' \| 'md' \| 'lg' \| 'xl'`                 | `'lg'`      | Font size scale.                           |
| `testId` | `string`                                       | `'heading'` | Data-testid attribute for testing drivers. |
