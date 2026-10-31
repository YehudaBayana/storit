# Alert

A simple, minimalist notification component for displaying information, success, or error messages.

## Import

    import { Alert } from '@/components/ui/alert/Alert';

## Usage

    <Alert variant="success" title="Payment Successful" onClose={() => console.log('closed')}>
      Your transaction has been processed.
    </Alert>

## Props

| Prop          | Type                             | Default             | Description                                      |
| ------------- | -------------------------------- | ------------------- | ------------------------------------------------ |
| `title`       | `string`                         | (Required)          | The main heading of the alert.                   |
| `variant`     | `'info' \| 'success' \| 'error'` | `'info'`            | Controls the styling and icon of the alert.      |
| `children`    | `React.ReactNode`                | `undefined`         | Optional body content displayed below the title. |
| `onClose`     | `() => void`                     | `undefined`         | Callback fired when the close button is clicked. |
| `data-testid` | `string`                         | `'alert-component'` | Test identifier for QA and unit tests.           |
