"use client";

import { Card, Image, Text, Badge, Group, AspectRatio } from "@mantine/core";
import { getVideoThumbnailUrl, Video } from "../api/videos";
import { formatDuration, formatFileSize, formatDate } from "../utils/formatters";

interface Props {
  video: Video;
  viewMode: "icons" | "list";
  onClick: (video: Video) => void;
}

export function VideoItemCard({ video, viewMode, onClick }: Props) {
  const thumbnailUrl = getVideoThumbnailUrl(video.id);
  const durationFormatted = formatDuration(video.duration_ms);

  if (viewMode === "list") {
    return (
      <Card
        shadow="xs"
        padding="sm"
        radius="md"
        withBorder
        onClick={() => onClick(video)}
        className="cursor-pointer hover:shadow-sm transition-shadow flex flex-row items-center gap-4"
      >
        <div className="relative w-28 h-16 flex-shrink-0">
          <Image
            src={thumbnailUrl}
            height={64}
            alt={video.title}
            className="object-cover rounded"
            fallbackSrc="https://placehold.co/600x400?text=No+Thumbnail"
          />
          <Badge className="absolute bottom-1 right-1 text-[10px] px-1 py-0 opacity-90" color="dark" radius="sm">
            {durationFormatted}
          </Badge>
        </div>
        <div className="flex-grow min-w-0 grid grid-cols-5 gap-2 items-center">
          <div className="col-span-2 truncate">
            <Text fw={500} size="sm" lineClamp={1}>
              {video.title}
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              {formatDate(video.created_at)}
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              {formatFileSize(video.size_bytes)}
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed" truncate>
              {video.mime_type || "video/mp4"}
            </Text>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      onClick={() => onClick(video)}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <Card.Section className="relative">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={thumbnailUrl}
            alt={video.title}
            fallbackSrc="https://placehold.co/600x400?text=No+Thumbnail"
          />
        </AspectRatio>
        <Badge className="absolute bottom-2 right-2 opacity-90 text-xs px-1.5" color="dark" radius="sm">
          {durationFormatted}
        </Badge>
      </Card.Section>
      <Group mt="xs" mb="xs">
        <Text fw={500} size="sm" lineClamp={1}>
          {video.title}
        </Text>
      </Group>
    </Card>
  );
}
