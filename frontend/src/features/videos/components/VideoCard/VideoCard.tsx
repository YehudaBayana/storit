"use client";

import { Badge, Box, Card, Image, Text } from "@/components/ui";

interface VideoCardProps {
  title: string;
  thumbnailUrl: string;
  duration: string;
}

export function VideoCard({ title, thumbnailUrl, duration }: VideoCardProps) {
  return (
    <Card>
      {/* Thumbnail section with the video length badge overlaid */}
      <Box position="relative">
        <Image loading="eager" src={thumbnailUrl} alt={title} unoptimized={true} />
        <Badge size="sm">{duration}</Badge>
      </Box>

      {/* Title section */}
      <Box>
        <Text truncate variant="body-sm">
          {title}
        </Text>
      </Box>
    </Card>
  );
}
