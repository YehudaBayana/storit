"use client";

import { SimpleGrid, Stack } from "@mantine/core";
import { VideoItemCard } from "./VideoItemCard";
import { Video } from "../api/videos";

interface Props {
  videos: Video[];
  viewMode: "icons" | "list";
  onVideoSelect: (video: Video) => void;
}

export function VideosList({ videos, viewMode, onVideoSelect }: Props) {
  if (viewMode === "list") {
    return (
      <Stack gap="sm">
        {videos.map((v) => (
          <VideoItemCard key={v.id} video={v} viewMode="list" onClick={onVideoSelect} />
        ))}
      </Stack>
    );
  }

  return (
    <SimpleGrid cols={{ base: 2, sm: 4, lg: 7, xl: 11 }} spacing="sm">
      {videos.map((v) => (
        <VideoItemCard key={v.id} video={v} viewMode="icons" onClick={onVideoSelect} />
      ))}
    </SimpleGrid>
  );
}
