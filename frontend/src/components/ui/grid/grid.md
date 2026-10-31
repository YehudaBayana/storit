# Grid Component

The `Grid` component abstracts CSS Grid layout rules into straightforward props, ensuring consistent column definitions and gap spacing across the application.

## Import

    import { Grid } from "@/components/ui";

## Usage Example

    import { Grid } from "@/components/ui";

    export default function MyComponent() {
      return (
        <Grid cols="{3}" gap="lg">
          <div>Column 1</div>
          <div>Column 2</div>
          <div>Column 3</div>
        </Grid>
      );
    }

## Props

| Prop   | Type    | Default | Description |
| :----- | :------ | :------ | :---------- |
| `cols` | `1      | 2       | 3           | 4    | 5    | 6     | 12`    | `1`                                      | Number of equal-width columns. |
| `gap`  | `'none' | 'xs'    | 'sm'        | 'md' | 'lg' | 'xl'` | `'md'` | Standardized spacing between grid items. |
