import React, { forwardRef } from "react";

/**
 * Box dimension size options.
 */
export type BoxSize = "full" | "auto" | "screen" | "fit" | "8" | "9" | "10" | "16" | "32" | "64";

/**
 * Allowed HTML elements for Box component.
 */
type BoxElement =
  "div" | "span" | "section" | "article" | "aside" | "main" | "header" | "footer" | "nav";

interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  /** Box content */
  children?: React.ReactNode;
  /** HTML element to render */
  as?: BoxElement;
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
  /** Margin (all sides) */
  m?: number;
  /** Horizontal margin */
  mx?: number;
  /** Vertical margin */
  my?: number;
  /** Margin top */
  mt?: number;
  /** Margin right */
  mr?: number;
  /** Margin bottom */
  mb?: number;
  /** Margin left */
  ml?: number;
  /** Border radius */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Background color class */
  bg?: string;
  /** Width */
  w?: BoxSize;
  /** Height */
  h?: BoxSize;
  /** CSS position behavior */
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  /** Inset shorthand (requires a non-static position) */
  inset?: "0" | "x-0" | "y-0";
  /** Stacking order */
  z?: "0" | "10" | "20" | "30" | "40" | "50";
  /** Overflow behavior on both axes */
  overflow?: "visible" | "hidden" | "auto" | "scroll";
  /** Vertical overflow behavior */
  overflowY?: "visible" | "hidden" | "auto" | "scroll";
  /** Fixed aspect ratio */
  aspect?: "video" | "square";
  /** Border side (uses the theme border color) */
  border?: "all" | "top" | "bottom" | "left" | "right";
  /** Border tone */
  borderTone?: "default" | "subtle" | "transparent";
  /** Minimum width constraint */
  minW?: "0";
  /** Grow to fill available space in a flex parent */
  grow?: boolean;
  /** Hide the element on a given breakpoint range */
  hideOn?: "mobile" | "desktop";
  /** Marks the element as a hover group for group-hover children */
  group?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test data hook selector */
  dataHook?: string;
}

/**
 * Build spacing classes from props.
 */
const buildSpacingClasses = (props: BoxProps): string => {
  const classes: string[] = [];

  // Padding
  if (props.p !== undefined) classes.push(`p-${props.p}`);
  if (props.px !== undefined) classes.push(`px-${props.px}`);
  if (props.py !== undefined) classes.push(`py-${props.py}`);
  if (props.pt !== undefined) classes.push(`pt-${props.pt}`);
  if (props.pr !== undefined) classes.push(`pr-${props.pr}`);
  if (props.pb !== undefined) classes.push(`pb-${props.pb}`);
  if (props.pl !== undefined) classes.push(`pl-${props.pl}`);

  // Margin
  if (props.m !== undefined) classes.push(`m-${props.m}`);
  if (props.mx !== undefined) classes.push(`mx-${props.mx}`);
  if (props.my !== undefined) classes.push(`my-${props.my}`);
  if (props.mt !== undefined) classes.push(`mt-${props.mt}`);
  if (props.mr !== undefined) classes.push(`mr-${props.mr}`);
  if (props.mb !== undefined) classes.push(`mb-${props.mb}`);
  if (props.ml !== undefined) classes.push(`ml-${props.ml}`);

  return classes.join(" ");
};

/**
 * Get rounded classes.
 */
const getRoundedClasses = (rounded?: BoxProps["rounded"]): string => {
  if (!rounded) return "";
  if (rounded === "none") return "rounded-none";
  return `rounded-${rounded}`;
};

/**
 * Get dimension classes.
 */
const getDimensionClasses = (w?: BoxProps["w"], h?: BoxProps["h"]): string => {
  const classes: string[] = [];

  if (w === "full") classes.push("w-full");
  else if (w === "auto") classes.push("w-auto");
  else if (w === "screen") classes.push("w-screen");
  else if (w === "fit") classes.push("w-fit");
  else if (w) classes.push(`w-${w}`);

  if (h === "full") classes.push("h-full");
  else if (h === "auto") classes.push("h-auto");
  else if (h === "screen") classes.push("h-screen");
  else if (h === "fit") classes.push("h-fit");
  else if (h) classes.push(`h-${h}`);

  return classes.join(" ");
};

/**
 * Get responsive visibility classes.
 */
const getHideOnClasses = (hideOn?: BoxProps["hideOn"]): string => {
  if (hideOn === "mobile") return "hidden md:block";
  if (hideOn === "desktop") return "md:hidden";
  return "";
};

/**
 * Get border classes.
 */
const getBorderClasses = (
  border?: BoxProps["border"],
  borderTone?: BoxProps["borderTone"],
): string => {
  if (!border) return "";

  const sideClass =
    border === "all"
      ? "border"
      : border === "top"
        ? "border-t"
        : border === "bottom"
          ? "border-b"
          : border === "left"
            ? "border-l"
            : "border-r";

  const toneClass =
    borderTone === "subtle"
      ? "border-[var(--border-subtle)]"
      : borderTone === "transparent"
        ? "border-transparent"
        : "border-[var(--border-default)]";

  return `${sideClass} ${toneClass}`;
};

/**
 * Get position classes.
 */
const getPositionClasses = (
  position?: BoxProps["position"],
  inset?: BoxProps["inset"],
  z?: BoxProps["z"],
): string => {
  const classes: string[] = [];

  if (position) classes.push(position === "static" ? "static" : position);
  if (inset === "0") classes.push("inset-0");
  else if (inset === "x-0") classes.push("inset-x-0");
  else if (inset === "y-0") classes.push("inset-y-0");
  if (z) classes.push(`z-${z}`);

  return classes.join(" ");
};

/**
 * Get overflow classes.
 */
const getOverflowClasses = (
  overflow?: BoxProps["overflow"],
  overflowY?: BoxProps["overflowY"],
): string => {
  const classes: string[] = [];

  if (overflow) classes.push(`overflow-${overflow}`);
  if (overflowY) classes.push(`overflow-y-${overflowY}`);

  return classes.join(" ");
};

/**
 * Get aspect ratio classes.
 */
const getAspectClasses = (aspect?: BoxProps["aspect"]): string => {
  if (aspect === "video") return "aspect-video";
  if (aspect === "square") return "aspect-square";
  return "";
};

/**
 * Box - Generic container component with common layout props.
 */
const Box = forwardRef<HTMLElement, BoxProps>(
  (
    {
      children,
      as: Element = "div",
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      rounded,
      bg,
      w,
      h,
      position,
      inset,
      z,
      overflow,
      overflowY,
      aspect,
      border,
      borderTone,
      minW,
      grow,
      hideOn,
      group,
      className = "",
      dataHook,
      ...props
    },
    ref,
  ) => {
    const spacingClasses = buildSpacingClasses({
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      children: null,
    });

    const classes = [
      spacingClasses,
      getRoundedClasses(rounded),
      getDimensionClasses(w, h),
      getPositionClasses(position, inset, z),
      getOverflowClasses(overflow, overflowY),
      getAspectClasses(aspect),
      getBorderClasses(border, borderTone),
      minW === "0" ? "min-w-0" : "",
      grow ? "flex-grow" : "",
      getHideOnClasses(hideOn),
      group ? "group" : "",
      bg || "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return React.createElement(
      Element,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { ...props, "data-hook": dataHook, className: classes, ref } as any,
      children,
    );
  },
);

Box.displayName = "Box";

export default Box;
