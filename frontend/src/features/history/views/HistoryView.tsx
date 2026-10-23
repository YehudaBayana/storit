"use client";

import { useEffect, useRef } from "react";
import { useHistory } from "../query/useHistory";
import TrackItem from "@/features/player/components/TrackItem";
import { Box, Button, Flex, Stack, Text } from "@/components/ui";

interface HistoryViewProps {
  dataHook?: string;
}

export default function HistoryView({ dataHook = "history-view-container" }: HistoryViewProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useHistory();
  const loadMoreRef = useRef<HTMLElement>(null);
  const tracks = data?.pages.flat() ?? [];

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasNextPage || isError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isError, isFetchingNextPage]);

  return (
    <Box p={10} dataHook={dataHook}>
      <Stack gap={4}>
        <Text variant="h1" dataHook="history-view-heading">
          History
        </Text>
        {isPending && (
          <Text role="status" dataHook="history-loading-text">
            Loading history...
          </Text>
        )}
        {isError && tracks.length === 0 && (
          <Flex align="center" gap={3} dataHook="history-error-container">
            <Text role="alert" dataHook="history-error-text">
              {error?.message || "Could not load history."}
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              dataHook="history-retry-button"
            >
              Try again
            </Button>
          </Flex>
        )}
        {!isPending && !isError && tracks.length === 0 && (
          <Text dataHook="history-empty-text">No listening history yet.</Text>
        )}
        {tracks.map((track, index) => (
          <TrackItem track={track} index={index} key={`${track.id}-${index}`} showCover />
        ))}
        {tracks.length > 0 && hasNextPage && (
          <Box
            ref={loadMoreRef}
            style={{ minHeight: "2rem" }}
            aria-hidden="true"
            dataHook="history-loadmore-trigger"
          />
        )}
        {isFetchingNextPage && (
          <Text role="status" dataHook="history-fetching-more-text">
            Loading more history...
          </Text>
        )}
        {isError && tracks.length > 0 && (
          <Flex align="center" gap={3} dataHook="history-loadmore-error-container">
            <Text role="alert" dataHook="history-loadmore-error-text">
              Could not load more history.
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchNextPage()}
              dataHook="history-loadmore-retry-button"
            >
              Retry
            </Button>
          </Flex>
        )}
      </Stack>
    </Box>
  );
}
