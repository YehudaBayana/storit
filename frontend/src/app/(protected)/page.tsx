import { VideoLibraryView } from "@/features/videos/views/VideoLibraryView";
import { getInitialVideos } from "../utils";
import { ResizableAppShell } from "@/components/appShell/AppShell";

export default async function HomePage() {
  const initialVideos = await getInitialVideos();

  return (
    <>
      <ResizableAppShell>
        <VideoLibraryView initialVideos={initialVideos} />
      </ResizableAppShell>
    </>
  );
}
