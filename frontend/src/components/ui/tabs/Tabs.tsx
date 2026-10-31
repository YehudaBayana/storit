import React, { useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  testId?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTabId,
  testId = "tabs",
  className = "",
}) => {
  const [activeId, setActiveId] = useState(defaultTabId || items[0]?.id);

  const activeItem = items.find((item) => item.id === activeId) || items[0];

  return (
    <div data-testid={testId} className={className}>
      <div className="flex border-b border-gray-200 gap-6">
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              data-testid={`${testId}-tab-${tab.id}`}
              onClick={() => setActiveId(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div data-testid={`${testId}-content`} className="py-4">
        {activeItem?.content}
      </div>
    </div>
  );
};
