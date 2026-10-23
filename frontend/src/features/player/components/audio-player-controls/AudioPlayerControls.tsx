import type { ChangeEvent, RefObject } from "react";
import Box from "@/components/ui/layout/Box";
import Flex from "@/components/ui/layout/Flex";
import IconButton from "@/components/ui/icon-button/IconButton";
import Slider from "@/components/ui/slider/Slider";
import Text from "@/components/ui/text/Text";
import { convertSecondsToTime } from "@/shared/utils";
import type { Track } from "@/types/global.types";

interface AudioPlayerControlsProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
  progressRef: RefObject<HTMLInputElement | null>;
  onPlayPause: () => void;
  onSeek: (event: ChangeEvent<HTMLInputElement>) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  dataHook?: string;
}

export default function AudioPlayerControls({
  currentTrack,
  isPlaying,
  isLoading,
  currentTime,
  duration,
  error,
  progressRef,
  onPlayPause,
  onSeek,
  onDragStart,
  onDragEnd,
  dataHook,
}: AudioPlayerControlsProps) {
  return (
    <Flex
      direction="col"
      align="center"
      gap={1}
      style={{ width: "40%", minWidth: "280px" }}
      dataHook={dataHook}
    >
      <Flex align="center" gap={4}>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Previous track"
          disabled={!currentTrack}
          icon="⏮"
        />

        <IconButton
          variant="primary"
          size="md"
          rounded
          onClick={onPlayPause}
          disabled={!currentTrack || isLoading}
          aria-label={isPlaying ? "Pause" : "Play"}
          dataHook={dataHook ? `${dataHook}-play-pause` : undefined}
          loading={isLoading}
          icon={isPlaying ? "⏸" : "▶"}
        />

        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Next track"
          disabled={!currentTrack}
          icon="⏭"
        />
      </Flex>

      <Flex align="center" gap={3} w="full">
        <Text variant="caption" color="muted" mono align="center">
          {convertSecondsToTime(currentTime)}
        </Text>
        <Box grow>
          <Slider
            ref={progressRef}
            dataHook={dataHook ? `${dataHook}-seek` : undefined}
            size="sm"
            color="primary"
            min={0}
            max={currentTrack?.duration || duration || 100}
            value={currentTime}
            onChange={onSeek}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
            onMouseUp={onDragEnd}
            onTouchEnd={onDragEnd}
            disabled={!currentTrack || isLoading}
          />
        </Box>
        <Text variant="caption" color="muted" mono align="center">
          {currentTrack?.duration ? convertSecondsToTime(currentTrack.duration) : "0:00"}
        </Text>
      </Flex>

      {error && (
        <Text variant="small" color="danger" weight="medium">
          {error}
        </Text>
      )}
    </Flex>
  );
}
