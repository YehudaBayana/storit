# Toast Component

The `Toast` component is used to show brief, temporary notifications, such as a successful file upload or a deletion error.

## Import

    import { Toast } from "@/components/ui";

## Usage Example

    import { Toast } from "@/components/ui";

    export default function MyComponent() {
      return (
        <Toast 
          variant="success" 
          title="File Uploaded" 
          message="Monthly_Report.pdf has been saved." 
          onClose={() => console.log('closed')} 
        />
      );
    }

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Required | Main notification text. |
| `message` | `string` | `undefined` | Secondary detailed text. |
| `variant` | `'success' | 'error' | 'info'` | `'success'` | Visual style and icon. |
| `onClose` | `() => void` | `undefined` | Optional callback to show a close button. |
