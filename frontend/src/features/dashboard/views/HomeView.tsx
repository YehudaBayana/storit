"use client";

import ServerStatus from "@/features/dashboard/components/ServerStatus";
import { VideosList } from "@/features/videos/components/VideosList/VideosList";
import { Box, Flex } from "@/components/ui";
import { useVideos } from "@/features/videos/query/useVideos";
import { useGetCurrentUser } from "@/features/auth/query/useAuth";

export default function HomeView() {
  const { data: videos = [], isLoading, isError, error: listError } = useVideos();
  const { data: currentUser } = useGetCurrentUser();
  return (
    <Box>
      <ServerStatus />
      <Flex>
        {isLoading && <p>Loading videos...</p>}
        {isError && <p>Error loading videos: {listError?.message}</p>}
        {!isLoading && !isError && currentUser && <VideosList videos={videos} />}
      </Flex>
    </Box>
  );
}
