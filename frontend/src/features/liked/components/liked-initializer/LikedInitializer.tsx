"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useLikedStore } from "@/features/liked/store/useLikedStore";
import { useGetLiked } from "@/features/liked/query/useLiked";
import { Box } from "@/components/ui";

interface LikedInitializerProps {
  children: React.ReactNode;
  dataHook?: string;
}

export default function LikedInitializer({
  children,
  dataHook = "liked-initializer",
}: LikedInitializerProps) {
  const setInitialLiked = useLikedStore((state) => state.setLikedList);
  const setLikedQueryState = useLikedStore((state) => state.setLikedQueryState);
  const { data, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isPending, refetch } =
    useGetLiked();
  const loadMoreRef = useRef<HTMLElement>(null);
  const tracks = useMemo(() => data?.pages.flat() ?? [], [data?.pages]);

  useEffect(() => {
    setLikedQueryState({ isPending, isError, refetch });
  }, [setLikedQueryState, isPending, isError, refetch]);

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

  useEffect(() => {
    if (isPending || !data) return; // Wait until the data is loaded
    setInitialLiked(tracks);
  }, [setInitialLiked, isPending, data, tracks]);

  return (
    <Box dataHook={dataHook} style={{ display: "contents" }}>
      {tracks.length > 0 && hasNextPage && (
        <Box
          ref={loadMoreRef}
          style={{ minHeight: "2rem" }}
          aria-hidden="true"
          dataHook={`${dataHook}-load-more-trigger`}
        />
      )}
      {children}
    </Box>
  );
}
