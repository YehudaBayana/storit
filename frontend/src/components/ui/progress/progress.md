# Progress Component

The `Progress` component visually displays the completion status of a task, such as a file upload or storage usage (e.g., "500 GB of 900 GB used").

## Import

    import { Progress } from "@/components/ui";

## Usage Example

    import { Progress } from "@/components/ui";

    export default function MyComponent() {
      return (
        <Progress value={65} size="md" />
      );
    }

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `number` | Required | Percentage of progress (0 to 100). |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Height of the progress bar. |
| `testId` | `string` | `'progress'` | Data-testid attribute for testing drivers. |
