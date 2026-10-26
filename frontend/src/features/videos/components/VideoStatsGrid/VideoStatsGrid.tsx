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
    <Grid cols={3} colsMobile={1} gap={4}>
      <Card variant="secondary" rounded="2xl" padding="md">
        <Stack gap={2}>
          <Text variant="body-sm" color="muted">
            Sessions
          </Text>
          <Heading level={3} size="3xl">
            {totalCount}
          </Heading>
        </Stack>
      </Card>

      <Card variant="secondary" rounded="2xl" padding="md">
        <Stack gap={2}>
          <Text variant="body-sm" color="muted">
            Processing
          </Text>
          <Heading level={3} size="3xl">
            {processingCount}
          </Heading>
        </Stack>
      </Card>

      <Card variant="secondary" rounded="2xl" padding="md">
        <Stack gap={2}>
          <Text variant="body-sm" color="muted">
            Ready
          </Text>
          <Heading level={3} size="3xl">
            {readyCount}
          </Heading>
        </Stack>
      </Card>
    </Grid>
  );
}
