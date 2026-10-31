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
      className={`overflow-hidden inline-block ${roundedClasses[rounded]} ${className} w-auto h-auto`}
    >
      <NextImage alt={alt} {...props} />
    </div>
  );
};
