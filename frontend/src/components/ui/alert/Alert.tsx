import React from "react";
import { FiInfo, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export type AlertVariant = "info" | "success" | "error";

export interface AlertProps {
  variant?: AlertVariant;
  title: string;
  children?: React.ReactNode;
  onClose?: () => void;
  "data-testid"?: string;
}

const icons = {
  info: FiInfo,
  success: FiCheckCircle,
  error: FiAlertCircle,
};

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  onClose,
  "data-testid": testId = "alert-component",
}) => {
  const Icon = icons[variant];
  const baseStyles = "p-4 rounded-md border flex items-start";

  // Relying on brand colors from tailwind.config.js
  const variantStyles = {
    info: "bg-blue-50 border-blue-200 text-brand-dark",
    success: "bg-brand-500/10 border-brand-500 text-brand-dark",
    error: "bg-red-50 border-red-200 text-brand-dark",
  };

  return (
    <div data-testid={testId} className={`${baseStyles} ${variantStyles[variant]}`}>
      <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <h3 data-testid={`${testId}-title`} className="text-sm font-medium">
          {title}
        </h3>
        {children && (
          <div data-testid={`${testId}-content`} className="mt-1 text-sm">
            {children}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          data-testid={`${testId}-close`}
          className="ml-3 text-gray-500 hover:text-brand-dark transition-colors"
        >
          <span className="sr-only">Close</span>
          &times;
        </button>
      )}
    </div>
  );
};
