import React from "react";
import { IoCheckmarkCircle, IoAlertCircle, IoClose } from "react-icons/io5";

export interface ToastProps {
  variant?: "success" | "error" | "info";
  title: string;
  message?: string;
  onClose?: () => void;
  testId?: string;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  variant = "success",
  title,
  message,
  onClose,
  testId = "toast",
  className = "",
}) => {
  const icons = {
    success: <IoCheckmarkCircle className="w-5 h-5 text-brand-500" />,
    error: <IoAlertCircle className="w-5 h-5 text-red-500" />,
    info: <IoAlertCircle className="w-5 h-5 text-blue-500" />,
  };

  const variants = {
    success: "bg-white border-gray-100 shadow-lg",
    error: "bg-white border-red-100 shadow-lg",
    info: "bg-white border-blue-100 shadow-lg",
  };

  return (
    <div
      data-testid={testId}
      className={`flex items-start gap-3 p-4 rounded-xl border max-w-sm w-full ${variants[variant]} ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        {message && <p className="text-xs text-gray-500 mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button
          data-testid={`${testId}-close`}
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <IoClose className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
