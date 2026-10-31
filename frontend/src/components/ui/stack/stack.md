# Stack

A layout container that aligns its children using flexbox.

## Import

    import { Stack } from '@/components/ui/Stack/Stack';

## Usage

    <Stack direction="col" gap="md">
      <div>First Item</div>
      <div>Second Item</div>
    </Stack>

## Props

| Prop      | Type                         | Default | Description                   |
|-----------|------------------------------|---------|-------------------------------|
| direction | 'row' \| 'col'               | 'col'   | Flexbox direction             |
| gap       | 'none' \| 'sm' \| 'md' \| 'lg'| 'md'    | Spacing between child elements|
