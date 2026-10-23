import React, { forwardRef } from "react";

export interface AudioProps extends React.AudioHTMLAttributes<HTMLAudioElement> {
  dataHook?: string;
}

const Audio = forwardRef<HTMLAudioElement, AudioProps>(({ dataHook, ...props }, ref) => {
  return <audio ref={ref} data-hook={dataHook} {...props} />;
});

Audio.displayName = "Audio";

export default Audio;
