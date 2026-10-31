import { ColorSchemeToggle } from "../../../components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from "../../../components/Welcome/Welcome";
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
