import { AudioVisualizer, Flex, Text } from "@/components/ui";
import type { Track } from "@/types/global.types";

interface AudioPlayerTrackInfoProps {
  track: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  dataHook?: string;
}

export default function AudioPlayerTrackInfo({
  track,
  isPlaying,
  isLoading,
  hasError,
  dataHook,
}: AudioPlayerTrackInfoProps) {
  return (
    <Flex
      align="center"
      gap={4}
      overflow="hidden"
      style={{ width: "30%", minWidth: "200px" }}
      dataHook={dataHook}
    >
      <AudioVisualizer isPlaying={isPlaying} size="md" />
      <Flex direction="col" minW="0">
        <Text
          variant="body-sm"
          weight="semibold"
          color="default"
          truncate
          dataHook={dataHook ? `${dataHook}-title` : undefined}
        >
          {track?.title || "No track playing"}
        </Text>
        <Text
          variant="caption"
          color="muted"
          truncate
          dataHook={dataHook ? `${dataHook}-status` : undefined}
        >
          {isLoading ? "Streaming from Go API..." : hasError ? "Error" : "YouTube Soundstream"}
        </Text>
      </Flex>
    </Flex>
  );
}
