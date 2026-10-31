# Input

A fundamental text input field with built-in error states.

## Import

    import { Input } from '@/components/ui/Input/Input';

## Usage

    <Input
      placeholder="Enter your email"
      hasError={false}
      onChange={(e) => console.log(e.target.value)}
    />

## Props

| Prop     | Type    | Default | Description                                 |
| -------- | ------- | ------- | ------------------------------------------- |
| hasError | boolean | false   | Triggers red border and ring for validation |
