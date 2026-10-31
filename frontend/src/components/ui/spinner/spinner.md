# Spinner Component

The `Spinner` component is an animated loading indicator used to show asynchronous background tasks or loading states within buttons and containers.

## Import

    import { Spinner } from "@/components/ui";

## Usage Example

    import { Spinner } from "@/components/ui";

    export default function MyComponent() {
      return (
        <div className="flex justify-center p-4">
          <Spinner size="lg"/>
        </div>
      );
    }

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Dimensions of the spinner ring. |
