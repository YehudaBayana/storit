import React from "react";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// A standard HTML form wrapper that automatically prevents the default page reload
// behavior on submission, ensuring client-side handling.
export const Form: React.FC<FormProps> = ({ onSubmit, children, className = "", ...props }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`} {...props}>
      {children}
    </form>
  );
};
