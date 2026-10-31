"use client";

import { useState } from "react";
import { VideosList } from "../components/VideosList";
import { FloatingVideoPlayer } from "../components/FloatingVideoPlayer";
import { Video } from "../api/videos";
import { useVideos } from "../query/useVideos";

export function VideoLibraryView({ initialVideos }: { initialVideos: Video[] }) {
  // State orchestrates which video is active and whether it should display in a modal or as PiP
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // TanStack starts with the server data, then handles polling in the background
  const { data: videos = [] } = useVideos(50, 0, initialVideos);
  // If data is still null or undefined, default to an empty array
  const safeVideos = videos ?? [];

  const handleVideoSelect = (video: Video) => {
    setActiveVideo(video);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setActiveVideo(null);
    setIsMinimized(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Video Library</h1>

      <VideosList videos={safeVideos} onVideoSelect={handleVideoSelect} />

      <FloatingVideoPlayer
        video={activeVideo}
        isMinimized={isMinimized}
        onClose={handleClose}
        onMinimize={() => setIsMinimized(true)}
        onMaximize={() => setIsMinimized(false)}
      />
    </div>
  );
}
