# Badge Component

The `Badge` component is a small visual indicator used for tags, file statuses, or categories. It supports multiple semantic color variants.

## Import

    import { Badge } from "@/components/ui";

## Usage Example

    import { Badge } from "@/components/ui";

    export default function MyComponent() {
      return (
        <Badge size="sm" variant="success">
          Completed
        </Badge>
      );
    }

## Props

| Prop      | Type       | Default   | Description |
| :-------- | :--------- | :-------- | :---------- |
| `variant` | `'success' | 'warning' | 'error'     | 'neutral'              | 'brand'` | `'neutral'` | Semantic color variant. |
| `size`    | `'sm'      | 'md'`     | `'md'`      | Padding and font size. |
