# EmptyState

A minimalist component used to display a placeholder when no data is available or a specific state is empty.

## Import

    import { EmptyState } from '@/components/ui/EmptyState/EmptyState';

## Usage Example

    import { FiInbox } from 'react-icons/fi';
    
    export default function ProjectsList() {
      return (
        <EmptyState
          title="No projects found"
          description="Get started by creating your first project and inviting your team."
          icon={<FiInbox />}
          action={
            <button className="bg-brand-500 text-white px-4 py-2 rounded-md hover:opacity-90">
              Create Project
            </button>
          }
        />
      );
    }

## Props

| Prop        | Type        | Required | Description                                      |
|-------------|-------------|----------|--------------------------------------------------|
| title       | string      | Yes      | Main heading text for the empty state            |
| description | string      | No       | Secondary explanatory text beneath the title     |
| icon        | ReactNode   | No       | Visual element (usually a `react-icons` component)|
| action      | ReactNode   | No       | Call to action element, such as a primary button |
