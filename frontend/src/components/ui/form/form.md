# Form

A wrapper for the native HTML `<form>` that intercepts standard submission to prevent page reloads, ensuring React state handles the data.

## Import

    import { Form } from '@/components/ui/Form/Form';

## Usage

    <Form onSubmit={(e) => console.log('Form submitted!')}>
      <Stack gap="md">
        <FormField label="Name">
          <Input name="firstName" />
        </FormField>
        <button type="submit">Save</button>
      </Stack>
    </Form>

## Props

| Prop     | Type                                        | Default | Description                   |
|----------|---------------------------------------------|---------|-------------------------------|
| onSubmit | (e: React.FormEvent<HTMLFormElement>) => void | -       | Required submit handler       |
