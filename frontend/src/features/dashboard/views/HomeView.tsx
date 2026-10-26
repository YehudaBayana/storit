"use client";

import Container from "@/components/ui/layout/Container";
import ServerStatus from "@/features/dashboard/components/ServerStatus";
import Box from "@/components/ui/layout/Box";
import { VideosList } from "@/features/videos/components/VideosList/VideosList";
import { Flex } from "@/components/ui";
import { useVideos } from "@/features/videos/query/useVideos";

interface HomeViewProps {
  dataHook?: string;
}

export default function HomeView({ dataHook = "home-view" }: HomeViewProps) {
  const { data: videos = [], isLoading, isError, error: listError } = useVideos();
  return (
    <Box dataHook={dataHook}>
      <Container size="xl">
        <ServerStatus />
        <Flex>
          {isLoading && <p>Loading videos...</p>}
          {isError && <p>Error loading videos: {listError?.message}</p>}
          {!isLoading && !isError && <VideosList videos={videos} />}
        </Flex>
      </Container>
    </Box>
  );
}
