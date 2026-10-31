# Link Component

The `Link` component wraps Next.js's native `next/link` to provide standardized typography, colors, and hover states for client-side navigation.

## Import

    import { Link } from "@/components/ui";

## Usage Example

    import { Link } from "@/components/ui";

    export default function MyComponent() {
      return (
        <Link href="/dashboard" variant="brand">
          Go to Dashboard
        </Link>
      );
    }

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'default' | 'subtle' | 'brand'` | `'default'` | Text color and hover styling. |
| `testId` | `string` | `'link'` | Data-testid attribute for testing drivers. |
| *(Any)* | *(NextLinkProps)* | | Inherits all Next.js Link props (href, replace, etc.). |
