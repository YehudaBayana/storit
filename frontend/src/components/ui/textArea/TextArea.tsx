import React from "react";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  testId?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = "", testId = "textarea", ...props }, ref) => {
    return (
      <div className="flex flex-col w-full" data-testid={`${testId}-container`}>
        {label && (
          <label htmlFor={props.id} className="mb-1 text-sm font-medium text-brand-dark">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          data-testid={testId}
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-brand-dark bg-white transition-colors ${
            error ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
          } ${props.disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : ""} ${className}`}
          {...props}
        />
        {error && (
          <span data-testid={`${testId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
