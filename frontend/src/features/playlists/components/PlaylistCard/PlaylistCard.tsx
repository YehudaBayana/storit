import { Badge, Box, Card, Flex, Heading, Image, Text } from "@/components/ui";
import { Playlist } from "@/types/global.types";

interface PlaylistCardProps {
  pl: Playlist;
  onClick: (playlist: Playlist) => void;
  dataHook?: string;
}

export const PlaylistCard = ({ onClick, pl: playlist, dataHook }: PlaylistCardProps) => {
  return (
    <Card
      key={playlist.id}
      clickable
      hoverable
      group
      variant="surface"
      onClick={() => onClick(playlist)}
      dataHook={dataHook}
    >
      <Card.Body padding="sm">
        <Flex direction="col" gap={3} h="full" justify="between">
          <Flex direction="col" gap={2}>
            <Box
              position="relative"
              aspect="video"
              w="full"
              rounded="lg"
              overflow="hidden"
              border="all"
              borderTone="subtle"
              bg="bg-[var(--bg-surface-hover)]"
            >
              {playlist.thumbnails.length > 0 ? (
                <Image
                  src={playlist.thumbnails[0].url}
                  alt={playlist.title}
                  fit="cover"
                  showSkeleton
                  fill
                />
              ) : (
                <Flex align="center" justify="center" w="full" h="full">
                  🎶
                </Flex>
              )}
              {playlist.playlist_count > 0 && (
                <Box position="absolute" z="10" style={{ bottom: "0.5rem", right: "0.5rem" }}>
                  <Badge variant="default" size="sm" pill>
                    {playlist.playlist_count} videos
                  </Badge>
                </Box>
              )}
            </Box>

            <Heading level={4} size="sm" clamp={2}>
              {playlist.title}
            </Heading>
          </Flex>

          <Flex justify="between" align="center" pt={2} border="top" borderTone="subtle">
            <Text variant="caption" color="muted" truncate>
              {playlist.channel || playlist.uploader || "YouTube"}
            </Text>
            <Text variant="caption" color="primary" weight="semibold">
              View →
            </Text>
          </Flex>
        </Flex>
      </Card.Body>
    </Card>
  );
};
