import { useState, useRef, SyntheticEvent } from "react";
import { usePlaybackUrl } from "../query/useVideos";

const MAX_PLAYBACK_RECOVERIES = 3;

export function useVideoPlaybackRecovery(videoId: string | undefined, isReady: boolean) {
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const resumeRef = useRef<{ time: number; paused: boolean } | null>(null);
  const recoveriesRef = useRef(0);
  const currentTimeRef = useRef<number>(0);

  const { data: playback, refetch: refetchPlayback } = usePlaybackUrl(
    videoId ?? "",
    Boolean(videoId && isReady),
  );

  const handlePlaybackError = () => {
    const element = videoElementRef.current;
    if (!element || recoveriesRef.current >= MAX_PLAYBACK_RECOVERIES) {
      return;
    }
    recoveriesRef.current += 1;
    resumeRef.current = { time: element.currentTime, paused: element.paused };
    void refetchPlayback();
  };

  const handleTimeUpdate = (e: SyntheticEvent<HTMLVideoElement>) => {
    currentTimeRef.current = e.currentTarget.currentTime;
  };

  const handleLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
    recoveriesRef.current = 0;
    const element = videoElementRef.current;
    const videoTarget = e.currentTarget;
    if (videoTarget.videoWidth && videoTarget.videoHeight) {
      setAspectRatio(videoTarget.videoWidth / videoTarget.videoHeight);
    }
    const resume = resumeRef.current;
    if (!element || !resume) {
      if (currentTimeRef.current > 0 && element && element.currentTime === 0) {
        element.currentTime = currentTimeRef.current;
      }
      return;
    }
    resumeRef.current = null;
    element.currentTime = resume.time;
    if (!resume.paused) {
      void element.play().catch(() => undefined);
    }
  };

  return {
    aspectRatio,
    videoElementRef,
    playback,
    handlePlaybackError,
    handleTimeUpdate,
    handleLoadedMetadata,
  };
}
