import React from "react";

export type AudioVisualizerSize = "sm" | "md" | "lg";
export type AudioVisualizerVariant = "primary" | "secondary" | "white";

export interface AudioVisualizerProps {
  /** Whether the audio is actively playing */
  isPlaying?: boolean;
  /** Size of the equalizer visualizer */
  size?: AudioVisualizerSize;
  /** Color variant */
  variant?: AudioVisualizerVariant;
  /** Additional CSS classes */
  className?: string;
  dataHook?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying = false,
  size = "md",
  variant = "primary",
  className = "",
  dataHook,
}) => {
  const barColor =
    variant === "primary" ? "bg-emerald-500" : variant === "secondary" ? "bg-teal-500" : "bg-white";

  const sizeClasses =
    size === "sm" ? "h-4 w-5 gap-[2px]" : size === "lg" ? "h-6 w-8 gap-[4px]" : "h-5 w-6 gap-[3px]";

  const barWidth = size === "sm" ? "w-[2px]" : size === "lg" ? "w-[4px]" : "w-[3px]";

  return (
    <div
      data-hook={dataHook}
      className={`flex items-end select-none flex-shrink-0 ${sizeClasses} ${className}`}
      aria-label={isPlaying ? "Audio playing" : "Audio paused"}
    >
      <span
        className={`${barWidth} ${barColor} rounded-full transition-all duration-300 ${
          isPlaying ? "animate-[bounce-bar_0.8s_ease_infinite_alternate] h-full" : "h-1"
        }`}
      />
      <span
        className={`${barWidth} ${barColor} rounded-full transition-all duration-300 ${
          isPlaying ? "animate-[bounce-bar_0.5s_ease_infinite_alternate_0.15s] h-full" : "h-1"
        }`}
      />
      <span
        className={`${barWidth} ${barColor} rounded-full transition-all duration-300 ${
          isPlaying ? "animate-[bounce-bar_0.7s_ease_infinite_alternate_0.3s] h-full" : "h-1"
        }`}
      />
      <span
        className={`${barWidth} ${barColor} rounded-full transition-all duration-300 ${
          isPlaying ? "animate-[bounce-bar_0.6s_ease_infinite_alternate_0.05s] h-full" : "h-1"
        }`}
      />
    </div>
  );
};

export default AudioVisualizer;
