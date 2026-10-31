import { getInitialVideos } from "@/app/utils";
import { VideoLibraryView } from "@/features/videos/views/VideoLibraryView";

export default async function VideosPage() {
  const initialVideos = await getInitialVideos();
  return <VideoLibraryView initialVideos={initialVideos} />;
}
