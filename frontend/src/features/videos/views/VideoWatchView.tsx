'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Badge, Box, Card, Flex, NavLink, Stack, Text, Title } from '@mantine/core';
import { getVideo, type Video as VideoModel } from '@/features/videos/api/videos';
import { usePlaybackUrl } from '@/features/videos/query/useVideos';

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
    videoId ?? '',
    Boolean(videoId) && video?.status === 'ready'
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
        setError(requestError instanceof Error ? requestError.message : 'Unable to load video.');
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
      <Box>
        <Stack gap={'md'}>
          <Alert title="Error">Missing video id.</Alert>
          <NavLink href="/videos">← Back to library</NavLink>
        </Stack>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Text>Loading video…</Text>
      </Box>
    );
  }

  if (error || !video) {
    return (
      <Box>
        <Stack gap={'md'}>
          <Alert title="Error">{error ?? 'Video not found.'}</Alert>
          <NavLink href="/videos">← Back to library</NavLink>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Stack gap={'lg'}>
        <Flex justify="between" align="center" gap={'md'}>
          <NavLink href="/videos">← Back to library</NavLink>
          <Badge size="sm">{video.status}</Badge>
        </Flex>

        <Card>
          {playback ? (
            <video
              key={video.id}
              ref={videoElementRef}
              controls
              src={playback.url}
              onError={handlePlaybackError}
              onLoadedMetadata={handleLoadedMetadata}
            />
          ) : (
            <Flex align="center" justify="center">
              <Text>
                {video.status === 'ready' && 'Loading video…'}
                {video.status === 'uploading' && 'This video is still uploading.'}
                {video.status === 'processing' && 'This video is being prepared for playback.'}
                {video.status === 'failed' &&
                  `Processing failed${video.failure_reason ? `: ${video.failure_reason}` : '.'}`}
              </Text>
            </Flex>
          )}
        </Card>

        <Card>
          <Stack gap={'md'}>
            <Title>{video.title || video.original_name}</Title>

            {video.notes ? (
              <Text>{video.notes}</Text>
            ) : (
              <Text>No notes recorded for this video.</Text>
            )}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
