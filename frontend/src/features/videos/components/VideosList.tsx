"use client";

import { SimpleGrid, Stack } from "@mantine/core";
import { VideoItemCard } from "./VideoItemCard";
import { Video } from "../api/videos";

interface Props {
  videos: Video[];
  viewMode: "icons" | "list";
  onVideoSelect: (video: Video) => void;
  onVideoDoubleClick?: (video: Video) => void;
  selectedVideoId?: string | null;
}

export function VideosList({
  videos,
  viewMode,
  onVideoSelect,
  onVideoDoubleClick,
  selectedVideoId,
}: Props) {
  if (viewMode === "list") {
    return (
      <Stack gap="sm">
        {videos.map((video) => (
          <VideoItemCard
            key={video.id}
            video={video}
            viewMode="list"
            onClick={onVideoSelect}
            onDoubleClick={onVideoDoubleClick}
            isSelected={video.id === selectedVideoId}
          />
        ))}
      </Stack>
    );
  }

  return (
    <SimpleGrid cols={{ base: 2, sm: 4, lg: 7, xl: 11 }} spacing="sm">
      {videos.map((video) => (
        <VideoItemCard
          key={video.id}
          video={video}
          viewMode="icons"
          onClick={onVideoSelect}
          onDoubleClick={onVideoDoubleClick}
          isSelected={video.id === selectedVideoId}
        />
      ))}
    </SimpleGrid>
  );
}
