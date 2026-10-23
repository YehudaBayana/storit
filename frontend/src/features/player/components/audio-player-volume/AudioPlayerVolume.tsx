import type { ChangeEvent } from "react";
import { Box, Flex, IconButton, Slider } from "@/components/ui";

interface AudioPlayerVolumeProps {
  hasTrack: boolean;
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  dataHook?: string;
}

export default function AudioPlayerVolume({
  hasTrack,
  isMuted,
  volume,
  onToggleMute,
  onVolumeChange,
  dataHook,
}: AudioPlayerVolumeProps) {
  return (
    <Flex
      justify="end"
      align="center"
      gap={4}
      style={{ width: "30%", minWidth: "150px" }}
      dataHook={dataHook}
    >
      <Flex align="center" gap={2}>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={onToggleMute}
          disabled={!hasTrack}
          aria-label={isMuted ? "Unmute" : "Mute"}
          dataHook={dataHook ? `${dataHook}-mute` : undefined}
          icon={isMuted || volume === 0 ? "🔇" : volume < 0.4 ? "🔈" : volume < 0.7 ? "🔉" : "🔊"}
        />
        <Box style={{ width: "5rem" }}>
          <Slider
            size="sm"
            color="secondary"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            dataHook={dataHook ? `${dataHook}-volume` : undefined}
            onChange={onVolumeChange}
            disabled={!hasTrack}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
