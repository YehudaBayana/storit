"use client";

import { Card, Image, Text, Badge, Group, AspectRatio } from "@mantine/core";
import { useVideos } from "../query/useVideos";
import { getVideoThumbnailUrl, Video } from "../api/videos";
import { VideosList } from "./VideosList";

interface Props {
  video: Video;
  onClick: (video: Video) => void;
}

export function VideosContainer({ initialVideos }: { initialVideos: Video[] }) {
  // TanStack starts with the server data, then handles polling in the background
  const { data: videos = [] } = useVideos(50, 0, initialVideos);
  // If data is still null or undefined, default to an empty array
  const safeVideos = videos ?? [];

  return <VideosList videos={safeVideos} onVideoSelect={() => {}} />;
}

export function VideoCard({ video, onClick }: Props) {
  const thumbnailUrl = getVideoThumbnailUrl(video.id);
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={() => onClick(video)}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <Card.Section className="relative">
        <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
          <Image
            src={thumbnailUrl}
            height={160}
            alt={video.title}
            fallbackSrc="https://placehold.co/600x400?text=No+Thumbnail"
          />
        </AspectRatio>
        <Badge className="absolute bottom-2 right-2 opacity-90" color="dark" radius="sm">
          {video.duration_ms}
        </Badge>
      </Card.Section>
      <Group mt="md" mb="xs">
        <Text fw={500} lineClamp={1}>
          {video.title}
        </Text>
      </Group>
    </Card>
  );
}
