"use client";

import React from "react";
import { Box, Flex, IconButton, Image, Menu, Text } from "@/components/ui";
import { usePlaybackStore } from "@/features/player/store/usePlaybackStore";
import { Track } from "@/types/global.types";
import { convertSecondsToTime } from "@/shared/utils";
import { usePostLiked } from "@/features/liked/query/useLiked";
import { useLikedStore } from "@/features/liked/store/useLikedStore";

interface TrackItemProps {
  track: Track;
  index?: number;
  showCover?: boolean;
  showCategory?: boolean;
  playlistId?: string; // If in a playlist context, we can support removal
  dataHook?: string;
}

export default function TrackItem({
  track,
  index,
  showCover = true,
  playlistId,
  dataHook,
}: TrackItemProps) {
  const currentChosenTrack = usePlaybackStore((s) => s.currentChosenTrack);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const playTrack = usePlaybackStore((s) => s.playTrack);
  const setPlaying = usePlaybackStore((s) => s.setPlaying);

  const { mutate: postLiked } = usePostLiked();
  const isLiked = useLikedStore((state) => state.isLiked);
  const isCurrent = currentChosenTrack?.id === track.id;
  const isCurrentLiked = isLiked(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      setPlaying(!isPlaying);
    } else {
      playTrack(track);
    }
  };

  return (
    <Flex
      align="center"
      justify="between"
      gap={4}
      group
      hoverable
      w="full"
      p={3}
      rounded="xl"
      border="all"
      borderTone={isCurrent ? "default" : "transparent"}
      bg={isCurrent ? "bg-[var(--bg-surface)]" : undefined}
      dataHook={dataHook}
    >
      {/* Left Part: Play/Index, Cover, Title */}
      <Flex align="center" gap={4} minW="0" grow>
        {/* Play Button or Index */}
        <Flex align="center" justify="center" w="8" h="8" position="relative">
          {isCurrent ? (
            <IconButton
              size="xs"
              variant="ghost"
              onClick={handlePlayClick}
              aria-label={isPlaying ? "Pause" : "Play"}
              dataHook={dataHook ? `${dataHook}-play-button` : undefined}
              icon={isPlaying ? "⏸" : "▶"}
            />
          ) : (
            <>
              {index !== undefined && (
                <Text variant="body-sm" color="muted" mono hideOnGroupHover>
                  {String(index + 1).padStart(2, "0")}
                </Text>
              )}
              <IconButton
                size="xs"
                variant="ghost"
                onClick={handlePlayClick}
                aria-label="Play"
                dataHook={dataHook ? `${dataHook}-play-button` : undefined}
                showOnGroupHover
                icon="▶"
              />
            </>
          )}
        </Flex>

        {/* Track Cover */}
        {showCover && (
          <Box
            position="relative"
            w="10"
            h="10"
            rounded="lg"
            overflow="hidden"
            border="all"
            borderTone={isCurrent ? "default" : "subtle"}
          >
            <Image
              src={track.thumbnails?.[track.thumbnails.length - 1].url || track.thumbnail}
              alt={track.title}
              fit="cover"
              fill
            />
          </Box>
        )}

        {/* Text Info */}
        <Flex direction="col" minW="0" grow>
          <Text
            variant="body-sm"
            weight={isCurrent ? "semibold" : "medium"}
            color={isCurrent ? "primary" : "default"}
            truncate
            dataHook={dataHook ? `${dataHook}-title` : undefined}
          >
            {track.title}
          </Text>
        </Flex>
      </Flex>

      {/* Middle/Right Part: Category and Actions */}
      <Flex align="center" gap={4}>
        {/* Duration */}
        <Text variant="small" color="muted" mono align="right">
          {convertSecondsToTime(track.duration)}
        </Text>

        {/* Like Heart Button */}
        <IconButton
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            postLiked(track);
          }}
          aria-label={isCurrentLiked ? "Unlike" : "Like"}
          dataHook={dataHook ? `${dataHook}-like-button` : undefined}
          hideUntilGroupHover={!isCurrentLiked}
          icon={isCurrentLiked ? "❤️" : "🤍"}
        />

        {/* Playlist Action Menu */}
        <Menu
          placement="bottom-end"
          dataHook={dataHook ? `${dataHook}-menu` : undefined}
          trigger={
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Track options"
              hideUntilGroupHover
              icon="⋮"
            />
          }
        >
          <Menu.Label>Playlists</Menu.Label>

          {playlistId && (
            <>
              <Menu.Divider />
              <Menu.Item danger icon="✕">
                Remove from Playlist
              </Menu.Item>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
}
