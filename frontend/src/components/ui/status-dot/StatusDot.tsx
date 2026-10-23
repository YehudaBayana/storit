import React from "react";

/**
 * StatusDot variant options.
 */
export type StatusDotVariant = "success" | "danger" | "warning" | "info" | "neutral";

/**
 * StatusDot size options.
 */
export type StatusDotSize = "sm" | "md" | "lg";

export interface StatusDotProps {
  /** Status color variant */
  variant?: StatusDotVariant;
  /** Dot size */
  size?: StatusDotSize;
  /** Animate the dot with a pulse to signal live activity */
  pulse?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test data hook selector */
  dataHook?: string;
}

/**
 * Get dot size classes.
 */
const getSizeClasses = (size: StatusDotSize): string => {
  switch (size) {
    case "sm":
      return "w-1.5 h-1.5";
    case "md":
      return "w-2.5 h-2.5";
    case "lg":
      return "w-3.5 h-3.5";
  }
};

/**
 * Get dot color classes.
 */
const getVariantClasses = (variant: StatusDotVariant): string => {
  switch (variant) {
    case "success":
      return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]";
    case "danger":
      return "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]";
    case "warning":
      return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]";
    case "info":
      return "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)]";
    case "neutral":
      return "bg-gray-400";
  }
};

/**
 * StatusDot - Small status indicator dot.
 *
 * Used to signal connectivity, health, or live state at a glance.
 *
 * Usage:
 *   <StatusDot variant="success" pulse />
 *   <StatusDot variant="danger" size="sm" />
 */
const StatusDot: React.FC<StatusDotProps> = ({
  variant = "success",
  size = "md",
  pulse = false,
  className = "",
  dataHook,
}) => {
  const classes = [
    "inline-block rounded-full flex-shrink-0",
    getSizeClasses(size),
    getVariantClasses(variant),
    pulse ? "animate-pulse" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span data-hook={dataHook} aria-hidden="true" className={classes} />;
};

export default StatusDot;
