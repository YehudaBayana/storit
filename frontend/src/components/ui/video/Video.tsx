import React from "react";

export interface VideoProps extends React.HTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  "data-testid"?: string;
}
// convert to forwardRef
export const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  ({
    src,
    poster,
    controls = true,
    autoPlay = false,
    loop = false,
    muted = false,
    className = "",
    "data-testid": testId = "video-component",
    ...props
  }) => {
    return (
      <div className={`overflow-hidden rounded-lg bg-brand-dark ${className}`}>
        <video
          data-testid={testId}
          src={src}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          className="w-full h-auto object-cover block"
          {...props}
        />
      </div>
    );
  },
);

Video.displayName = "Video";
