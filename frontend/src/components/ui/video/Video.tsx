import React from "react";

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
  "data-testid"?: string;
  controls?: boolean;
}

export const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  (
    { src, className = "", controls = true, "data-testid": testId = "video-component", ...props },
    ref,
  ) => {
    return (
      <div className={`overflow-hidden rounded-lg bg-brand-dark ${className}`}>
        <video
          {...props}
          ref={ref}
          data-testid={testId}
          src={src}
          controls={controls ? true : undefined}
          className="w-full h-auto object-cover block"
        />
      </div>
    );
  },
);

Video.displayName = "Video";
