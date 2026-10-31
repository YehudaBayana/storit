# Modal Component

The `Modal` component is a floating overlay used for focused tasks like editing a file name, confirming a deletion, or uploading documents. It handles its own backdrop and escape-key dismissal.

## Import

    import { Modal } from "@/components/ui";

## Usage Example

    import { Modal, Button } from "@/components/ui";
    import { useState } from "react";

    export default function MyComponent() {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
          <Modal title="Upload File" isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <p>Select a file to upload to your Cloudy storage.</p>
          </Modal>
        </>
      );
    }

## Props

| Prop      | Type         | Default   | Description                                                  |
| :-------- | :----------- | :-------- | :----------------------------------------------------------- |
| `isOpen`  | `boolean`    | Required  | Controls the visibility of the modal.                        |
| `onClose` | `() => void` | Required  | Callback fired when the backdrop or close button is clicked. |
| `title`   | `string`     | Required  | The header text of the modal.                                |
| `testId`  | `string`     | `'modal'` | Data-testid attribute for testing drivers.                   |
