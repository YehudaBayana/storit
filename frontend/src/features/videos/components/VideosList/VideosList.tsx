"use client";

import { Box, Grid, Heading, Link } from "@/components/ui";
import { Video } from "@/features/videos/api/videos";
import { getVideoThumbnailUrl } from "@/features/videos/api/videos";
import { VideoCard } from "@/features/videos/components/VideoCard/VideoCard";

interface VideosListProps {
  videos: Video[];
}

export function VideosList({ videos }: VideosListProps) {
  return (
    <Box>
      {/* Page Title using atomic Heading component */}
      <Heading size="lg" weight="bold">
        Video Library
      </Heading>

      {/* Grid layout for video cards using atomic Grid component */}
      <Heading size="md" weight="semibold" className="mt-4 mb-2">
        uploaded videos
      </Heading>
      <Grid cols={5} colsTablet={3} colsMobile={2}>
        {videos
          .filter((video) => video.status === "ready")
          .map((video: Video) => (
            <Link key={video.id} href={`/videos/${video.id}`}>
              <VideoCard
                title={video.title}
                thumbnailUrl={getVideoThumbnailUrl(video.id)}
                duration={Math.floor(video.duration_ms! / 1000) + "s"}
              />
            </Link>
          ))}
      </Grid>
      <Heading size="md" weight="semibold" className="mt-4 mb-2">
        processing videos
      </Heading>
      <Grid cols={5} colsTablet={3} colsMobile={2}>
        {videos
          .filter((video) => video.status === "processing")
          .map((video: Video) => (
            <Link key={video.id} href={`/videos/${video.id}`}>
              <VideoCard
                title={video.title}
                thumbnailUrl={getVideoThumbnailUrl(video.id)}
                duration={Math.floor(video.duration_ms! / 1000) + "s"}
              />
            </Link>
          ))}
      </Grid>
      <Heading size="md" weight="semibold" className="mt-4 mb-2">
        failed videos
      </Heading>
      <Grid cols={5} colsTablet={3} colsMobile={2}>
        {videos
          .filter((video) => video.status === "failed")
          .map((video: Video) => (
            <Link key={video.id} href={`/videos/${video.id}`}>
              <VideoCard
                title={video.title}
                thumbnailUrl={getVideoThumbnailUrl(video.id)}
                duration={Math.floor(video.duration_ms! / 1000) + "s"}
              />
            </Link>
          ))}
      </Grid>
    </Box>
  );
}
