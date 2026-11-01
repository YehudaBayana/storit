"use client";

import { VideosList } from "../components/VideosList";
import { Video } from "../api/videos";
import { useVideos } from "../query/useVideos";
import { Box, Title } from "@mantine/core";
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";

export function VideoLibraryView({ initialVideos }: { initialVideos: Video[] }) {
  const { playVideo } = useVideoPlayerStore();

  const { data: videos = [] } = useVideos(50, 0, initialVideos);
  const safeVideos = videos ?? [];

  const handleVideoSelect = (video: Video) => {
    playVideo(video);
  };

  return (
    <Box>
      <Title className="text-2xl font-bold mb-6">Video Library</Title>
      <VideosList videos={safeVideos} onVideoSelect={handleVideoSelect} />
    </Box>
  );
}
