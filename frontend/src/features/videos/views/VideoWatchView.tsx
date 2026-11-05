"use client";

import { useParams } from "next/navigation";
import { Alert, Badge, Box, Card, Flex, NavLink, Stack, Text, Title } from "@mantine/core";
import { useVideos } from "@/features/videos/query/useVideos";
import { useVideoPlaybackRecovery } from "../hooks/useVideoPlaybackRecovery";

export default function VideoWatchView() {
  const params = useParams<{ id: string }>();
  const videoId = params?.id;
  const { data: videos, isLoading: isVideosLoading, error: queryError } = useVideos();
  const video = videos?.find((v) => v.id === videoId);
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Unable to load video."
    : null;

  const {
    aspectRatio,
    videoElementRef,
    playback,
    handlePlaybackError,
    handleTimeUpdate,
    handleLoadedMetadata,
  } = useVideoPlaybackRecovery(videoId ?? "", Boolean(videoId && video?.status === "ready"));

  if (!videoId) {
    return (
      <Box p="md">
        <Stack gap="md">
          <Alert title="Error">Missing video id.</Alert>
          <NavLink href="/folders" label="Back to folders" />
        </Stack>
      </Box>
    );
  }

  if (isVideosLoading) {
    return (
      <Box p="md">
        <Text>Loading video…</Text>
      </Box>
    );
  }

  if (error || (!video && !isVideosLoading)) {
    return (
      <Box p="md">
        <Stack gap="md">
          <Alert title="Error">{error ?? "Video not found."}</Alert>
          <NavLink href="/folders" label="Back to folders" />
        </Stack>
      </Box>
    );
  }

  return (
    <Box p="md">
      <Stack gap="lg">
        <Flex justify="space-between" align="center" gap="md">
          <NavLink
            href="/folders"
            label="Back to folders"
            style={{ flex: "none", width: "auto" }}
          />
          <Badge size="sm">{video?.status || "ready"}</Badge>
        </Flex>

        <Card shadow="sm" p="0" radius="md" withBorder>
          <Box
            style={{
              width: "100%",
              aspectRatio: `${aspectRatio}`,
              background: "#000",
              position: "relative",
            }}
          >
            {playback?.url && video ? (
              <video
                key={video.id}
                ref={videoElementRef}
                src={playback.url}
                controls
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={handlePlaybackError}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                <track kind="captions" />
              </video>
            ) : (
              <Flex
                justify="center"
                align="center"
                style={{ height: "100%", color: "#fff", flexDirection: "column", gap: "8px" }}
              >
                <Text>
                  {video?.status === "ready" && "Loading video…"}
                  {video?.status === "uploading" && "This video is still uploading."}
                  {video?.status === "processing" && "This video is being prepared for playback."}
                  {video?.status === "failed" &&
                    `Processing failed${video?.failure_reason ? `: ${video.failure_reason}` : "."}`}
                </Text>
              </Flex>
            )}
          </Box>
        </Card>

        <Card shadow="sm" p="md" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>{video?.title || video?.original_name || "Video"}</Title>
            {video?.notes ? (
              <Text>{video.notes}</Text>
            ) : (
              <Text c="dimmed">No notes recorded for this video.</Text>
            )}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
