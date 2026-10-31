# Flex Component

The `Flex` component is built on top of the `Box` component. It abstracts standard flexbox CSS properties into simple props to effortlessly handle alignment, direction, and spacing without repeating raw Tailwind classes.

## Import

    import { Flex } from "@/components/ui";

## Usage Example

    import { Flex } from "@/components/ui";

    export default function MyComponent() {
      return (
        <Flex align="center" direction="row" gap="md" justify="between">
          <span>Left Side</span>
          <span>Right Side</span>
        </Flex>
      );
    }

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `direction` | `'row' | 'col' | 'row-reverse' | 'col-reverse'` | `'row'` | Flex direction. |
| `align` | `'start' | 'center' | 'end' | 'stretch' | 'baseline'` | `'stretch'` | Align-items property. |
| `justify` | `'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'` | `'start'` | Justify-content property. |
| `wrap` | `'wrap' | 'nowrap' | 'wrap-reverse'` | `'nowrap'` | Flex wrap behavior. |
| `gap` | `'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'` | `'none'` | Standardized spacing between items. |
