"use client";

import TrackItem from "@/features/player/components/TrackItem";
import { Box, Button, Flex, Stack, Text } from "@/components/ui";
import { useLikedStore } from "../store/useLikedStore";

interface LikedViewProps {
  dataHook?: string;
}

export default function LikedView({ dataHook = "liked-view-container" }: LikedViewProps) {
  const refetch = useLikedStore((state) => state.refetch);
  const isPending = useLikedStore((state) => state.isPending);
  const isError = useLikedStore((state) => state.isError);
  const tracks = useLikedStore((state) => state.likedTracks);
  return (
    <Box p={10} dataHook={dataHook}>
      <Stack gap={4}>
        <Text variant="h1" dataHook="liked-view-heading">
          Liked
        </Text>
        {isPending && (
          <Text role="status" dataHook="liked-loading-text">
            Loading liked tracks...
          </Text>
        )}
        {isError && tracks.length === 0 && (
          <Flex align="center" gap={3} dataHook="liked-error-container">
            <Text role="alert" dataHook="liked-error-text">
              {"Could not load liked tracks."}
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch && void refetch()}
              dataHook="liked-retry-button"
            >
              Try again
            </Button>
          </Flex>
        )}
        {!isPending && !isError && tracks.length === 0 && (
          <Text dataHook="liked-empty-text">No listening liked tracks yet.</Text>
        )}
        {tracks.map((track, index) => (
          <TrackItem track={track} index={index} key={`${track.id}-${index}`} showCover />
        ))}
        {isError && tracks.length > 0 && (
          <Flex align="center" gap={3} dataHook="liked-loadmore-error-container">
            <Text role="alert" dataHook="liked-loadmore-error-text">
              Could not load more liked tracks.
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch && void refetch()}
              dataHook="liked-loadmore-retry-button"
            >
              Retry
            </Button>
          </Flex>
        )}
      </Stack>
    </Box>
  );
}
