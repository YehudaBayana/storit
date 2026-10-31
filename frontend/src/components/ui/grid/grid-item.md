# GridItem

A layout component designed to be used as a child of the `Grid` component. It handles specific span definitions for rows and columns.

## Import

    import { GridItem } from "@/components/ui/grid/GridItem";

## Usage Example

    import { Grid } from "@/components/ui/grid/Grid";
    import { GridItem } from "@/components/ui/grid/GridItem";

    export default function Layout() {
      return (
        <Grid cols={12} gap="md">
          <GridItem colSpan={8} className="bg-brand-500 text-white p-4">
            Main Content
          </GridItem>
          <GridItem colSpan={4} className="bg-gray-100 text-brand-dark p-4">
            Sidebar
          </GridItem>
        </Grid>
      );
    }

## Props

| Prop       | Type               | Default       | Description                      |
| :--------- | :----------------- | :------------ | :------------------------------- |
| `colSpan`  | `1 \| 2 ... \| 12` | `undefined`   | Number of columns the item spans |
| `rowSpan`  | `1 \| 2 ... \| 6`  | `undefined`   | Number of rows the item spans    |
| `testId`   | `string`           | `'grid-item'` | Data-testid for DOM targeting    |
| `...props` | `HTMLAttributes`   | -             | Standard HTML div attributes     |
