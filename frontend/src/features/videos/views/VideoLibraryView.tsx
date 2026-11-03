"use client";

import { useState } from "react";
import { VideosList } from "../components/VideosList";
import { VideoViewToggle } from "../components/VideoViewToggle";
import { Video } from "../api/videos";
import { useVideos } from "../query/useVideos";
import { Box, Group, Title } from "@mantine/core";
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";

export function VideoLibraryView({ initialVideos }: { initialVideos: Video[] }) {
  const { playVideo } = useVideoPlayerStore();
  const [viewMode, setViewMode] = useState<"icons" | "list">("icons");

  const { data: videos = [] } = useVideos(50, 0, initialVideos);
  const safeVideos = videos ?? [];

  const handleVideoSelect = (video: Video) => {
    playVideo(video);
  };

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Title className="text-2xl font-bold">Video Library</Title>
        <VideoViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </Group>
      <VideosList videos={safeVideos} viewMode={viewMode} onVideoSelect={handleVideoSelect} />
    </Box>
  );
}
