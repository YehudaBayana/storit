import React from "react";

/**
 * Flex direction options.
 */
export type FlexDirection = "row" | "row-reverse" | "col" | "col-reverse";

/**
 * Flex alignment options.
 */
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";

/**
 * Flex justify options.
 */
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

/**
 * Flex wrap options.
 */
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

/**
 * Flex dimension size options.
 */
export type FlexSize = "full" | "auto" | "screen" | "fit" | "8" | "9" | "10" | "16" | "32" | "64";

/**
 * Allowed HTML elements for Flex component.
 */
type FlexElement =
  | "div"
  | "span"
  | "section"
  | "article"
  | "aside"
  | "main"
  | "header"
  | "footer"
  | "nav"
  | "ul"
  | "ol"
  | "li";

interface FlexProps {
  /** Flex content */
  children: React.ReactNode;
  /** Flex direction */
  direction?: FlexDirection;
  /** Cross-axis alignment */
  align?: FlexAlign;
  /** Main-axis alignment */
  justify?: FlexJustify;
  /** Wrap behavior */
  wrap?: FlexWrap;
  /** Gap between items */
  gap?: number;
  /** Flex grow */
  grow?: boolean;
  /** Flex shrink */
  shrink?: boolean;
  /** Inline flex */
  inline?: boolean;
  /** Width */
  w?: FlexSize;
  /** Height */
  h?: FlexSize;
  /** Full width shortcut */
  fullWidth?: boolean;
  /** Full height shortcut */
  fullHeight?: boolean;
  /** CSS position behavior */
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  /** Inset shorthand (requires a non-static position) */
  inset?: "0" | "x-0" | "y-0";
  /** Stacking order */
  z?: "0" | "10" | "20" | "30" | "40" | "50";
  /** Overflow behavior on both axes */
  overflow?: "visible" | "hidden" | "auto" | "scroll";
  /** Border side (uses the theme border color) */
  border?: "all" | "top" | "bottom" | "left" | "right";
  /** Border tone */
  borderTone?: "default" | "subtle" | "transparent";
  /** Minimum width constraint */
  minW?: "0";
  /** Highlight with the theme surface hover styles */
  hoverable?: boolean;
  /** Background color class */
  bg?: string;
  /** Border radius */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Padding (all sides) */
  p?: number;
  /** Horizontal padding */
  px?: number;
  /** Vertical padding */
  py?: number;
  /** Padding top */
  pt?: number;
  /** Padding right */
  pr?: number;
  /** Padding bottom */
  pb?: number;
  /** Padding left */
  pl?: number;
  /** Hide the element on a given breakpoint range */
  hideOn?: "mobile" | "desktop";
  /** Marks the element as a hover group for group-hover children */
  group?: boolean;
  /** HTML element to render */
  as?: FlexElement;
  /** Inline styles for one-off layout adjustments */
  style?: React.CSSProperties;
  /** Additional CSS classes */
  className?: string;
  dataHook?: string;
}

/**
 * Get direction classes.
 */
const getDirectionClasses = (direction: FlexDirection): string => {
  switch (direction) {
    case "row":
      return "flex-row";
    case "row-reverse":
      return "flex-row-reverse";
    case "col":
      return "flex-col";
    case "col-reverse":
      return "flex-col-reverse";
  }
};

/**
 * Get alignment classes.
 */
const getAlignClasses = (align: FlexAlign): string => {
  switch (align) {
    case "start":
      return "items-start";
    case "center":
      return "items-center";
    case "end":
      return "items-end";
    case "stretch":
      return "items-stretch";
    case "baseline":
      return "items-baseline";
  }
};

/**
 * Get justify classes.
 */
const getJustifyClasses = (justify: FlexJustify): string => {
  switch (justify) {
    case "start":
      return "justify-start";
    case "center":
      return "justify-center";
    case "end":
      return "justify-end";
    case "between":
      return "justify-between";
    case "around":
      return "justify-around";
    case "evenly":
      return "justify-evenly";
  }
};

/**
 * Get wrap classes.
 */
const getWrapClasses = (wrap: FlexWrap): string => {
  switch (wrap) {
    case "nowrap":
      return "flex-nowrap";
    case "wrap":
      return "flex-wrap";
    case "wrap-reverse":
      return "flex-wrap-reverse";
  }
};

/**
 * Get position classes.
 */
const getPositionClasses = (
  position?: FlexProps["position"],
  inset?: FlexProps["inset"],
  z?: FlexProps["z"],
): string => {
  const classes: string[] = [];

  if (position) classes.push(position);
  if (inset === "0") classes.push("inset-0");
  else if (inset === "x-0") classes.push("inset-x-0");
  else if (inset === "y-0") classes.push("inset-y-0");
  if (z) classes.push(`z-${z}`);

  return classes.join(" ");
};

/**
 * Flex - Low-level flexbox layout component.
 */
const Flex: React.FC<FlexProps> = ({
  children,
  direction = "row",
  align = "stretch",
  justify = "start",
  wrap = "nowrap",
  gap,
  grow,
  shrink,
  inline = false,
  w,
  h,
  fullWidth,
  fullHeight,
  position,
  inset,
  z,
  overflow,
  border,
  borderTone,
  minW,
  hoverable,
  bg,
  rounded,
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  hideOn,
  group,
  as = "div",
  style,
  className = "",
  dataHook,
}) => {
  const Element = as;

  const getSizeClass = (value: FlexSize | undefined, axis: "w" | "h"): string =>
    value ? `${axis}-${value}` : "";

  const widthClass = fullWidth ? "w-full" : getSizeClass(w, "w");
  const heightClass = fullHeight ? "h-full" : getSizeClass(h, "h");
  const hideOnClass =
    hideOn === "mobile" ? "hidden md:flex" : hideOn === "desktop" ? "md:hidden" : "";

  const borderSideClass =
    border === "all"
      ? "border"
      : border === "top"
        ? "border-t"
        : border === "bottom"
          ? "border-b"
          : border === "left"
            ? "border-l"
            : border === "right"
              ? "border-r"
              : "";
  const borderToneClass = border
    ? borderTone === "subtle"
      ? "border-[var(--border-subtle)]"
      : borderTone === "transparent"
        ? "border-transparent"
        : "border-[var(--border-default)]"
    : "";

  const classes = [
    inline ? "inline-flex" : "flex",
    getDirectionClasses(direction),
    getAlignClasses(align),
    getJustifyClasses(justify),
    getWrapClasses(wrap),
    gap !== undefined ? `gap-${gap}` : "",
    grow ? "flex-grow" : "",
    shrink === false ? "flex-shrink-0" : "",
    getPositionClasses(position, inset, z),
    overflow ? `overflow-${overflow}` : "",
    borderSideClass,
    borderToneClass,
    hoverable
      ? "hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-default)] transition-colors duration-200"
      : "",
    minW === "0" ? "min-w-0" : "",
    p !== undefined ? `p-${p}` : "",
    px !== undefined ? `px-${px}` : "",
    py !== undefined ? `py-${py}` : "",
    pt !== undefined ? `pt-${pt}` : "",
    pr !== undefined ? `pr-${pr}` : "",
    pb !== undefined ? `pb-${pb}` : "",
    pl !== undefined ? `pl-${pl}` : "",
    rounded ? `rounded-${rounded}` : "",
    bg || "",
    hideOnClass,
    group ? "group" : "",
    widthClass,
    heightClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Element className={classes} data-hook={dataHook} style={style}>
      {children}
    </Element>
  );
};

export default Flex;
