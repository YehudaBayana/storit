'use client';

import { Card, Grid, Stack, Text, Title } from '@mantine/core';
import { Video } from '@/features/videos/api/videos';

interface VideoStatsGridProps {
  videos: Video[];
}

export function VideoStatsGrid({ videos }: VideoStatsGridProps) {
  const totalCount = videos.length;
  const processingCount = videos.filter((video) => video.status === 'processing').length;
  const readyCount = videos.filter((video) => video.status === 'ready').length;

  return (
    <Grid columns={3} gap={'lg'}>
      <Card variant="bordered">
        <Stack gap={'sm'}>
          <Text>Sessions</Text>
          <Title>{totalCount}</Title>
        </Stack>
      </Card>

      <Card variant="bordered">
        <Stack gap={'sm'}>
          <Text>Processing</Text>
          <Title>{processingCount}</Title>
        </Stack>
      </Card>

      <Card variant="bordered">
        <Stack gap={'sm'}>
          <Text>Ready</Text>
          <Title>{readyCount}</Title>
        </Stack>
      </Card>
    </Grid>
  );
}
