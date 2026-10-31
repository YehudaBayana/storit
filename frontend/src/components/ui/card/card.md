# Card Component

The `Card` component is a flexible container used to group related information, like a suggested folder or a file preview in your dashboard.

## Import

    import { Card } from "@/components/ui";

## Usage Example

    import { Card } from "@/components/ui";

    export default function MyComponent() {
      return (
        <Card variant="interactive" className="p-4">
          Folder: Tech Innovations
        </Card>
      );
    }

## Props

| Prop      | Type       | Default    | Description                                |
| :-------- | :--------- | :--------- | :----------------------------------------- |
| `variant` | `'default' | 'bordered' | 'interactive'`                             | `'default'` | Visual style, including hover states. |
| `testId`  | `string`   | `'card'`   | Data-testid attribute for testing drivers. |
