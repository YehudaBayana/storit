import React from "react";

export interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

// Wraps an input to provide a consistent label and validation error message.
export const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-brand-dark">{label}</label>

      {children}

      {error && (
        <span className="text-sm text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
