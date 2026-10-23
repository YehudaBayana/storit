"use client";
import { useParams } from "next/navigation";
import { Badge, Box, Card, Container, Flex, Heading, Image, Spinner, Text } from "@/components/ui";
import TrackItem from "@/features/player/components/TrackItem";
import { usePlaylistDetails, usePlaylistTracks } from "@/features/playlists/query/usePlaylists";

interface PlaylistDetailViewProps {
  dataHook?: string;
}

const PlaylistDetailView = ({ dataHook = "playlist-detail-view" }: PlaylistDetailViewProps) => {
  const params = useParams();
  const selectedPlaylistId = params?.id as string;
  const { data: playlistDetails } = usePlaylistDetails(selectedPlaylistId);
  const {
    data: tracks,
    isLoading: isTracksLoading,
    error: tracksError,
  } = usePlaylistTracks(selectedPlaylistId);

  if (!playlistDetails) return null;

  const headerImage =
    playlistDetails.thumbnails && playlistDetails.thumbnails.length > 0
      ? playlistDetails.thumbnails[playlistDetails.thumbnails.length - 1].url
      : "";

  return (
    <Box dataHook={dataHook}>
      <Container size="xl">
        {/* Playlist Header */}
        <Card variant="surface" rounded="2xl" padding="lg">
          <Flex align="center" gap={6}>
            {headerImage && (
              <Box w="32" h="32" position="relative" rounded="xl" overflow="hidden" border="all">
                <Image src={headerImage} alt={playlistDetails.title} fit="cover" fill />
              </Box>
            )}
            <Flex direction="col" gap={2} minW="0" grow>
              <Box>
                <Badge variant="primary" size="sm">
                  PLAYLIST
                </Badge>
              </Box>
              <Heading level={1} size="xl" truncate dataHook={`${dataHook}-title`}>
                {playlistDetails.title}
              </Heading>
              {playlistDetails.uploader && (
                <Text variant="body-sm" color="muted">
                  By {playlistDetails.uploader}
                </Text>
              )}
              <Text variant="body" color="default" clamp={2}>
                {playlistDetails.description}
              </Text>
              <Text variant="caption" color="primary">
                {playlistDetails.playlist_count
                  ? `${playlistDetails.playlist_count} tracks`
                  : `${tracks?.length} tracks`}
              </Text>
            </Flex>
          </Flex>
        </Card>

        {/* Playlist Tracks List */}
        <Box mt={6}>
          {isTracksLoading ? (
            <Flex justify="center" align="center" py={16}>
              <Spinner size="lg" dataHook={`${dataHook}-tracks-loading`} />
            </Flex>
          ) : tracksError ? (
            <Flex direction="col" align="center" justify="center" gap={2} py={16}>
              <Text variant="h3" color="danger" align="center">
                Failed to load tracks
              </Text>
              <Text
                variant="body"
                color="muted"
                align="center"
                dataHook={`${dataHook}-tracks-error`}
              >
                {tracksError.message}
              </Text>
            </Flex>
          ) : tracks?.length === 0 ? (
            <Flex direction="col" align="center" justify="center" gap={2} py={16}>
              <Text variant="h3" align="center" dataHook={`${dataHook}-tracks-empty`}>
                No tracks found
              </Text>
              <Text variant="body" color="muted" align="center">
                This playlist has no available tracks.
              </Text>
            </Flex>
          ) : (
            <Flex direction="col" gap={2}>
              {tracks?.map((track, index) => {
                return (
                  <TrackItem
                    key={track.id}
                    track={track}
                    index={index}
                    playlistId={playlistDetails.id}
                  />
                );
              })}
            </Flex>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PlaylistDetailView;
