import React from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";

export interface ImageProps extends Omit<NextImageProps, "alt"> {
  alt: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  testId?: string;
}

export const Image: React.FC<ImageProps> = ({
  alt,
  rounded = "none",
  className = "",
  testId = "image",
  style, // 1. Extract style from props so we can merge it safely
  ...props
}) => {
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div
      data-testid={testId}
      // 2. You can remove w-auto and h-auto from this wrapper div
      className={`overflow-hidden inline-block ${roundedClasses[rounded]} ${className}`}
    >
      <NextImage
        alt={alt}
        // 3. Apply the auto styles directly to the Next.js image
        style={{ width: "auto", height: "auto", ...style }}
        {...props}
      />
    </div>
  );
};
