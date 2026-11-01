import { VideoLibraryView } from "@/features/videos/views/VideoLibraryView";
import { getInitialVideos } from "../utils";
import { ResizableAppShell } from "@/components/appShell/AppShell";
import { Title } from "@mantine/core";

export default async function HomePage() {
  const initialVideos = await getInitialVideos();

  return (
    <>
      <Title>Storit home page</Title>
      <VideoLibraryView initialVideos={initialVideos} />
    </>
  );
}
