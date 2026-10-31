# Tabs Component

The `Tabs` component allows users to navigate between different views within the same context, like switching between "All Files" and "Recent".

## Import

    import { Tabs } from "@/components/ui";

## Usage Example

    import { Tabs } from "@/components/ui";

    export default function MyComponent() {
      const tabItems = [
        { id: 'overview', label: 'Overview', content: <p>Overview content</p> },
        { id: 'settings', label: 'Settings', content: <p>Settings content</p> },
      ];

      return (
        <Tabs items={tabItems} defaultTabId="overview" />
      );
    }

## Props

| Prop           | Type        | Default     | Description                                |
| :------------- | :---------- | :---------- | :----------------------------------------- |
| `items`        | `TabItem[]` | Required    | Array of tab objects (id, label, content). |
| `defaultTabId` | `string`    | `undefined` | The ID of the tab to open initially.       |
| `testId`       | `string`    | `'tabs'`    | Data-testid attribute for testing drivers. |
