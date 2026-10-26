"use client";

import { useVideos } from "@/features/videos/query/useVideos";
import { Alert, Card, Container, EmptyState, Flex, Heading, Stack, Text } from "@/components/ui";
import { UploadVideoForm } from "@/features/videos/components/UploadVideoForm/UploadVideoForm";
import { VideoStatsGrid } from "@/features/videos/components/VideoStatsGrid/VideoStatsGrid";
import { VideosList } from "@/features/videos/components/VideosList/VideosList";
import { useGetCurrentUser } from "@/features/auth/query/useAuth";

export default function VideoLibraryView({
  dataHook = "video-library-view",
}: {
  dataHook?: string;
}) {
  const { data: videos = [], isLoading, isError, error: listError } = useVideos();
  const { data: currentUser, isLoading: isCurrentUserLoading } = useGetCurrentUser();
  if (isCurrentUserLoading) {
    return <Text>Loading user...</Text>;
  }
  if (!currentUser) {
    return <Text>User not logged in.</Text>;
  }
  return (
    <Container size="lg" dataHook={dataHook}>
      <Card variant="surface" rounded="3xl" padding="xl">
        <Stack gap={8}>
          <Flex justify="between" align="start" gap={4}>
            <Stack gap={1}>
              <Text variant="caption" color="primary" weight="semibold">
                PRIVATE ARCHIVE
              </Text>
              <Heading level={2} size="3xl">
                Your dance videos
              </Heading>
            </Stack>
          </Flex>

          <UploadVideoForm />

          <VideoStatsGrid videos={videos} />

          <Card variant="dashed" rounded="2xl" padding="lg">
            {isLoading ? (
              <Text variant="body-sm" color="muted" align="center">
                Loading videos...
              </Text>
            ) : isError ? (
              <Alert variant="error">
                {listError instanceof Error ? listError.message : "Unable to load videos."}
              </Alert>
            ) : videos.length === 0 ? (
              <EmptyState type="library"></EmptyState>
            ) : (
              <VideosList videos={videos} />
            )}
          </Card>
        </Stack>
      </Card>
    </Container>
  );
}
