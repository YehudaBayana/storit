"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getVideo, type Video as VideoModel } from "@/features/videos/api/videos";
import { usePlaybackUrl } from "@/features/videos/query/useVideos";
import {
  Container,
  Card,
  Flex,
  Stack,
  Heading,
  Text,
  Badge,
  Link,
  Alert,
  Video,
} from "@/components/ui";

const MAX_PLAYBACK_RECOVERIES = 3;

export default function VideoWatchView() {
  const params = useParams<{ id: string }>();
  const videoId = params?.id;
  const [video, setVideo] = useState<VideoModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const resumeRef = useRef<{ time: number; paused: boolean } | null>(null);
  const recoveriesRef = useRef(0);
  const { data: playback, refetch: refetchPlayback } = usePlaybackUrl(
    videoId ?? "",
    Boolean(videoId) && video?.status === "ready",
  );

  // An expired signed URL makes the player fail on the next range request: fetch a new one and resume.
  const handlePlaybackError = () => {
    const element = videoElementRef.current;
    if (!element || recoveriesRef.current >= MAX_PLAYBACK_RECOVERIES) return;
    recoveriesRef.current += 1;
    resumeRef.current = { time: element.currentTime, paused: element.paused };
    void refetchPlayback();
  };

  const handleLoadedMetadata = () => {
    recoveriesRef.current = 0;
    const element = videoElementRef.current;
    const resume = resumeRef.current;
    if (!element || !resume) return;
    resumeRef.current = null;
    element.currentTime = resume.time;
    if (!resume.paused) void element.play().catch(() => undefined);
  };

  useEffect(() => {
    if (!videoId) {
      return;
    }

    let isMounted = true;

    getVideo(videoId)
      .then((data) => {
        if (!isMounted) return;
        setVideo(data);
        setError(null);
      })
      .catch((requestError) => {
        if (!isMounted) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load video.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <Container size="lg">
        <Stack gap={4}>
          <Alert variant="danger">Missing video id.</Alert>
          <Link href="/videos" variant="back">
            ← Back to library
          </Link>
        </Stack>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container size="lg">
        <Text variant="body" color="muted">
          Loading video…
        </Text>
      </Container>
    );
  }

  if (error || !video) {
    return (
      <Container size="lg">
        <Stack gap={4}>
          <Alert variant="danger">{error ?? "Video not found."}</Alert>
          <Link href="/videos" variant="back">
            ← Back to library
          </Link>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap={6}>
        <Flex justify="between" align="center" gap={3}>
          <Link href="/videos" variant="back">
            ← Back to library
          </Link>
          <Badge variant="secondary" pill size="sm">
            {video.status}
          </Badge>
        </Flex>

        <Card variant="surface" rounded="3xl" padding="md">
          {playback ? (
            <Video
              key={video.id}
              ref={videoElementRef}
              controls
              playsInline
              preload="metadata"
              src={playback.url}
              onError={handlePlaybackError}
              onLoadedMetadata={handleLoadedMetadata}
            />
          ) : (
            <Flex align="center" justify="center" h="full" w="full">
              <Text variant="body-sm" color="muted" align="center">
                {video.status === "ready" && "Loading video…"}
                {video.status === "uploading" && "This video is still uploading."}
                {video.status === "processing" && "This video is being prepared for playback."}
                {video.status === "failed" &&
                  `Processing failed${video.failure_reason ? `: ${video.failure_reason}` : "."}`}
              </Text>
            </Flex>
          )}
        </Card>

        <Card variant="surface" rounded="3xl" padding="lg">
          <Stack gap={3}>
            <Heading level={1} size="3xl">
              {video.title || video.original_name}
            </Heading>
            <Text variant="caption" color="muted">
              {video.recorded_at
                ? new Date(video.recorded_at).toLocaleDateString()
                : "Recorded date unavailable"}
            </Text>

            {video.notes ? (
              <Text variant="body">{video.notes}</Text>
            ) : (
              <Text variant="body-sm" color="muted">
                No notes recorded for this video.
              </Text>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
