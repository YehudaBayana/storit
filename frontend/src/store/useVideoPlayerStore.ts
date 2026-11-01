import { create } from "zustand";
import { Video } from "@/features/videos/api/videos";

interface VideoPlayerState {
  activeVideo: Video | null;
  isMinimized: boolean;
  playVideo: (video: Video) => void;
  closeVideo: () => void;
  minimizeVideo: () => void;
  maximizeVideo: () => void;
}

export const useVideoPlayerStore = create<VideoPlayerState>((set) => ({
  activeVideo: null,
  isMinimized: false,
  playVideo: (video) => set({ activeVideo: video, isMinimized: false }),
  closeVideo: () => set({ activeVideo: null, isMinimized: false }),
  minimizeVideo: () => set({ isMinimized: true }),
  maximizeVideo: () => set({ isMinimized: false }),
}));
