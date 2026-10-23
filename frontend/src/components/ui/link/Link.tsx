import React from "react";
import NextLink from "next/link";

/**
 * Link variant options.
 */
export type LinkVariant = "default" | "primary" | "muted" | "inherit" | "nav" | "card" | "back";

/**
 * Link size options.
 */
export type LinkSize = "sm" | "md" | "lg";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target URL (Next.js href) */
  href?: string;
  /** Backward compatibility target URL */
  to?: string;
  /** Link content */
  children: React.ReactNode;
  /** Link style variant */
  variant?: LinkVariant;
  /** Link size */
  size?: LinkSize;
  /** Whether the nav link is active */
  active?: boolean;
  /** External link (uses <a> instead of NextLink) */
  external?: boolean;
  /** Show underline */
  underline?: "always" | "hover" | "none";
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  dataHook?: string;
}

/**
 * Get variant classes.
 */
const getVariantClasses = (variant: LinkVariant, active: boolean): string => {
  switch (variant) {
    case "nav":
      return `relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 cursor-pointer ${
        active
          ? "bg-[var(--bg-surface-active)] text-emerald-400 shadow-[inset_0_1px_0_var(--border-default)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
      }`;
    case "card":
      return "flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] p-4 transition hover:border-emerald-500/80";
    case "back":
      return "inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-medium";
    case "default":
      return "text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white";
    case "primary":
      return "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300";
    case "muted":
      return "text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300";
    case "inherit":
      return "text-inherit hover:opacity-80";
  }
};

/**
 * Get size classes.
 */
const getSizeClasses = (size: LinkSize, variant: LinkVariant): string => {
  if (variant === "nav" || variant === "card" || variant === "back") {
    return "";
  }
  switch (size) {
    case "sm":
      return "text-sm";
    case "md":
      return "text-base";
    case "lg":
      return "text-lg";
  }
};

/**
 * Get underline classes.
 */
const getUnderlineClasses = (underline: LinkProps["underline"], variant: LinkVariant): string => {
  if (variant === "nav" || variant === "card" || variant === "back") {
    return "no-underline";
  }
  switch (underline) {
    case "always":
      return "underline underline-offset-2";
    case "hover":
      return "hover:underline underline-offset-2";
    case "none":
      return "no-underline";
    default:
      return "hover:underline underline-offset-2";
  }
};

/**
 * Link - Styled link component.
 */
const Link: React.FC<LinkProps> = ({
  children,
  href,
  to,
  variant = "default",
  size = "md",
  active = false,
  external = false,
  underline = "hover",
  leftIcon,
  rightIcon,
  className = "",
  dataHook,
  ...props
}) => {
  const targetHref = href ?? to ?? "#";
  const isNavVariant = variant === "nav";

  const classes = [
    isNavVariant ? "" : "inline-flex items-center gap-1",
    "transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
    "dark:focus-visible:ring-offset-slate-900",
    getVariantClasses(variant, active),
    getSizeClasses(size, variant),
    getUnderlineClasses(underline, variant),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {isNavVariant && active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      )}
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </>
  );

  if (external) {
    return (
      <a
        href={targetHref}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        data-hook={dataHook}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <NextLink href={targetHref} className={classes} data-hook={dataHook} {...props}>
      {content}
    </NextLink>
  );
};

export default Link;
