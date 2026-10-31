# Image Component

The `Image` component wraps Next.js's native `next/image` to enforce design system rules like border-radius while maintaining performance optimizations.

## Import

    import { Image } from "@/components/ui";

## Usage Example

    import { Image } from "@/components/ui";

    export default function MyComponent() {
      return (
        <Image
          src="/avatar.png"
          alt="User Profile"
          width={40}
          height={40}
          rounded="full"
        />
      );
    }

## Props

| Prop      | Type     | Default   | Description                                            |
| :-------- | :------- | :-------- | :----------------------------------------------------- |
| `rounded` | `'none'  | 'sm'      | 'md'                                                   | 'lg' | 'full'` | `'none'` | Border radius token. |
| `alt`     | `string` | Required  | Accessibility text (enforced over standard NextImage). |
| `testId`  | `string` | `'image'` | Data-testid attribute for testing drivers.             |
