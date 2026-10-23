import React, { forwardRef } from "react";

export type VideoAspectRatio = "video" | "square" | "auto";
export type VideoRounded = "none" | "md" | "lg" | "xl" | "2xl";

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  aspectRatio?: VideoAspectRatio;
  rounded?: VideoRounded;
  dataHook?: string;
}

const getAspectRatioClasses = (aspectRatio: VideoAspectRatio): string => {
  switch (aspectRatio) {
    case "video":
      return "aspect-video";
    case "square":
      return "aspect-square";
    case "auto":
      return "";
  }
};

const getRoundedClasses = (rounded: VideoRounded): string => {
  switch (rounded) {
    case "none":
      return "rounded-none";
    case "md":
      return "rounded-md";
    case "lg":
      return "rounded-lg";
    case "xl":
      return "rounded-xl";
    case "2xl":
      return "rounded-2xl";
  }
};

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ aspectRatio = "video", rounded = "2xl", className = "", dataHook, ...props }, ref) => {
    const classes = [
      "w-full bg-black",
      getAspectRatioClasses(aspectRatio),
      getRoundedClasses(rounded),
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <video ref={ref} className={classes} data-hook={dataHook} {...props} />;
  },
);

Video.displayName = "Video";

export default Video;
