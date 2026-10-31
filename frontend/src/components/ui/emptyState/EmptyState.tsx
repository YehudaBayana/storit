import React from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-gray-100 bg-white w-full">
      {icon && (
        <div data-testid="empty-state-icon" className="mb-4 text-brand-500 text-5xl">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-brand-dark mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm" data-testid="empty-state-description">
          {description}
        </p>
      )}
      {action && <div data-testid="empty-state-action">{action}</div>}
    </div>
  );
};
