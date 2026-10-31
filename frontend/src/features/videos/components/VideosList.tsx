"use client";

import { SimpleGrid } from "@mantine/core";
import { VideoCard } from "./VideoCard";
import { Video } from "../api/videos";
interface Props {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

export function VideosList({ videos, onVideoSelect }: Props) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="lg">
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} onClick={onVideoSelect} />
      ))}
    </SimpleGrid>
  );
}
