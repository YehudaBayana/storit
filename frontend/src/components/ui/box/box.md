# Box Component

The `Box` component is the foundational layout primitive. It renders a flexible HTML element (defaulting to a `div`) and acts as a base wrapper for passing Tailwind utility classes and standard HTML attributes.

## Import

    import { Box } from "@/components/ui";

## Usage Example

    import { Box } from "@/components/ui";

    export default function MyComponent() {
      return (
        <Box as="section" className="p-6 bg-white rounded-xl shadow-sm">
          Standard container content
        </Box>
      );
    }

## Props

| Prop        | Type                | Default | Description                                    |
| :---------- | :------------------ | :------ | :--------------------------------------------- |
| `as`        | `React.ElementType` | `'div'` | The HTML element or React component to render. |
| `testId`    | `string`            | `'box'` | Data-testid attribute for testing drivers.     |
| `className` | `string`            | `''`    | Tailwind CSS utility classes.                  |
