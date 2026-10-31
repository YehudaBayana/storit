import { VideosContainer } from "@/features/videos/components/VideoCard";
import { ColorSchemeToggle } from "../../../components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from "../../../components/Welcome/Welcome";
import { listVideos } from "@/features/videos/api/videos";
import { cookies } from "next/headers";
import { VideoLibraryView } from "@/features/videos/views/VideoLibraryView";
import { getInitialVideos } from "../utils";

export default async function HomePage() {
  const initialVideos = await getInitialVideos();

  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <VideoLibraryView initialVideos={initialVideos} />
    </>
  );
}
