"use client";

import { useVideos } from "@/features/videos/query/useVideos";
import { Alert, Box, Card, EmptyState, Flex, Heading, Stack, Text } from "@/components/ui";
import { UploadVideoForm } from "@/features/videos/components/UploadVideoForm/UploadVideoForm";
import { VideoStatsGrid } from "@/features/videos/components/VideoStatsGrid/VideoStatsGrid";
import { VideosList } from "@/features/videos/components/VideosList/VideosList";
import { useGetCurrentUser } from "@/features/auth/query/useAuth";

export default function VideoLibraryView({}: { dataHook?: string }) {
  const { data: videos = [], isLoading, isError, error: listError } = useVideos();
  const { data: currentUser, isLoading: isCurrentUserLoading } = useGetCurrentUser();
  if (isCurrentUserLoading) {
    return <Text>Loading user...</Text>;
  }
  if (!currentUser) {
    return <Text>User not logged in.</Text>;
  }
  return (
    <Box>
      <Card variant="interactive">
        <Stack gap={"lg"}>
          <Flex justify="between" align="start" gap={"lg"}>
            <Stack gap={"sm"}>
              <Text>PRIVATE ARCHIVE</Text>
              <Heading>Your dance videos</Heading>
            </Stack>
          </Flex>

          <UploadVideoForm />

          <VideoStatsGrid videos={videos} />

          <Card variant="interactive">
            {isLoading ? (
              <Text>Loading videos...</Text>
            ) : isError ? (
              <Alert
                title={listError instanceof Error ? listError.message : "Unable to load videos."}
                variant="error"
              />
            ) : videos.length === 0 ? (
              <EmptyState title="you do not have any videos" />
            ) : (
              <VideosList videos={videos} />
            )}
          </Card>
        </Stack>
      </Card>
    </Box>
  );
}
