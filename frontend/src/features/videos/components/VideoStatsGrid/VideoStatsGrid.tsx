"use client";

import { Card, Grid, Heading, Stack, Text } from "@/components/ui";
import { Video } from "@/features/videos/api/videos";

interface VideoStatsGridProps {
  videos: Video[];
}

export function VideoStatsGrid({ videos }: VideoStatsGridProps) {
  const totalCount = videos.length;
  const processingCount = videos.filter((video) => video.status === "processing").length;
  const readyCount = videos.filter((video) => video.status === "ready").length;

  return (
    <Grid cols={3} gap={"lg"}>
      <Card variant="bordered">
        <Stack gap={"sm"}>
          <Text>Sessions</Text>
          <Heading>{totalCount}</Heading>
        </Stack>
      </Card>

      <Card variant="bordered">
        <Stack gap={"sm"}>
          <Text>Processing</Text>
          <Heading>{processingCount}</Heading>
        </Stack>
      </Card>

      <Card variant="bordered">
        <Stack gap={"sm"}>
          <Text>Ready</Text>
          <Heading>{readyCount}</Heading>
        </Stack>
      </Card>
    </Grid>
  );
}
