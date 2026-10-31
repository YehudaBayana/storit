import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

// We use forwardRef so parent components can directly access the DOM input element if needed.
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ hasError, className = "", ...props }, ref) => {
    const baseStyles =
      "w-full rounded-md border px-4 py-2 text-brand-dark transition-colors focus:outline-none focus:ring-2";
    const stateStyles = hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-brand-500 focus:border-brand-500";

    return <input ref={ref} className={`${baseStyles} ${stateStyles} ${className}`} {...props} />;
  },
);

Input.displayName = "Input";
