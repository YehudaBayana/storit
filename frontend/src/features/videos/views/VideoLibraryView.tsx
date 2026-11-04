"use client";

import { useEffect, useState } from "react";
import { VideosList } from "../components/VideosList";
import { VideoViewToggle } from "../components/VideoViewToggle";
import { Video } from "../api/videos";
import { useVideos } from "../query/useVideos";
import { Box, Group, Title, Button, Text, Card, Breadcrumbs } from "@mantine/core";
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";
import {
  useFolders,
  useFolderContents,
  useCreateFolder,
  useTrashItems,
} from "@/features/folders/query/useFolders";
import { IconFolder, IconTrash, IconPlus, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export function VideoLibraryView({ initialVideos }: { initialVideos: Video[] }) {
  const router = useRouter();
  const { playVideo } = useVideoPlayerStore();
  const [viewMode, setViewMode] = useState<"icons" | "list">("icons");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return new URLSearchParams(window.location.search).get("id");
  });
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "My Library" },
  ]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"library" | "trash">("library");

  const { data: folders = [] } = useFolders();
  const { data: folderContents = [] } = useFolderContents(currentFolderId);
  const { data: trashItems = [] } = useTrashItems();
  const createFolderMutation = useCreateFolder();

  const { data: videos = [] } = useVideos(50, 0, initialVideos);
  const safeVideos = videos ?? [];

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const folderId = new URLSearchParams(window.location.search).get("id");
      setCurrentFolderId(folderId);
      setSelectedVideoId(null);
      const historyBreadcrumbs = event.state?.breadcrumbs as BreadcrumbItem[] | undefined;
      if (historyBreadcrumbs) {
        setBreadcrumbs(historyBreadcrumbs);
      } else if (folderId) {
        const folder = folders.find((item) => item.id === folderId);
        setBreadcrumbs([
          { id: null, name: "My Library" },
          ...(folder ? [{ id: folder.id, name: folder.name }] : []),
        ]);
      } else {
        setBreadcrumbs([{ id: null, name: "My Library" }]);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [folders]);

  const navigateToFolder = (folderId: string | null, folderName: string) => {
    if (folderId === currentFolderId) {
      return;
    }

    const currentFolderFromList = folders.find((folder) => folder.id === currentFolderId);
    const currentBreadcrumbs =
      currentFolderId && breadcrumbs.at(-1)?.id !== currentFolderId
        ? [
            { id: null, name: "My Library" },
            ...(currentFolderFromList
              ? [{ id: currentFolderFromList.id, name: currentFolderFromList.name }]
              : []),
          ]
        : breadcrumbs;
    const nextBreadcrumbs =
      folderId === null
        ? [{ id: null, name: "My Library" }]
        : [
            ...currentBreadcrumbs.slice(
              0,
              currentBreadcrumbs.findIndex((item) => item.id === currentFolderId) + 1,
            ),
            { id: folderId, name: folderName },
          ];
    const pathname = window.location.pathname;
    const url = folderId ? `${pathname}?id=${folderId}` : pathname;

    setCurrentFolderId(folderId);
    setBreadcrumbs(nextBreadcrumbs);
    setSelectedVideoId(null);
    window.history.pushState({ folderId, breadcrumbs: nextBreadcrumbs }, "", url);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideoId(video.id);
  };

  const handleVideoDoubleClick = (video: Video) => {
    playVideo(video);
    router.push(`/videos/${video.id}`);
  };

  const handleCreateFolderPrompt = () => {
    const name = prompt("Enter folder name:");
    if (name) {
      createFolderMutation.mutate({ name, parent_id: currentFolderId });
    }
  };

  const currentFolder =
    breadcrumbs.find((folder) => folder.id === currentFolderId) ??
    folders.find((folder) => folder.id === currentFolderId);
  const visibleBreadcrumbs =
    currentFolderId && breadcrumbs.at(-1)?.id !== currentFolderId && currentFolder
      ? [...breadcrumbs, { id: currentFolder.id, name: currentFolder.name }]
      : currentFolderId === null && breadcrumbs.length > 1
        ? [{ id: null, name: "My Library" }]
        : breadcrumbs;

  if (currentView === "trash") {
    return (
      <Box>
        <Group justify="space-between" mb="lg">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => setCurrentView("library")}
            >
              Back to Library
            </Button>
            <Title className="text-2xl font-bold">Trash</Title>
          </Group>
        </Group>
        <Box className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trashItems?.map((item) => (
            <Card key={item.id} withBorder padding="md" radius="md">
              <Group justify="space-between">
                <Text fw={500}>{item.name}</Text>
                <Text size="xs" c="dimmed">
                  {item.type}
                </Text>
              </Group>
            </Card>
          ))}
          {trashItems?.length === 0 && <Text c="dimmed">Trash is empty</Text>}
        </Box>
      </Box>
    );
  }

  const displayFolders = folderContents.filter((item) => item.type === "folder");

  const videosByID = new Map(safeVideos.map((video) => [video.id, video]));
  const displayVideos: Video[] = folderContents
    .filter((item) => item.type === "video")
    .map((item) => {
      const videoId = item.video?.id ?? item.id;
      const existingVideo = videosByID.get(videoId);
      if (existingVideo) {
        return { ...existingVideo, title: item.name };
      }

      return {
        id: videoId,
        title: item.name,
        notes: "",
        status: item.video?.status ?? "ready",
        size_bytes: item.video?.size_bytes ?? 0,
        thumbnail_key: item.video?.thumbnail_key ?? undefined,
        duration_ms: item.video?.duration_ms ?? undefined,
        created_at: item.created_at,
        updated_at: item.updated_at,
        owner_id: "",
        original_name: item.name,
        original_key: "",
      };
    });

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Group>
          {currentFolderId && (
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigateToFolder(null, "My Library")}
            >
              Back
            </Button>
          )}
          <Breadcrumbs>
            {visibleBreadcrumbs.map((breadcrumb) => (
              <Button
                key={breadcrumb.id ?? "root"}
                variant={currentFolderId === breadcrumb.id ? "filled" : "subtle"}
                size="compact-sm"
                onClick={() => navigateToFolder(breadcrumb.id, breadcrumb.name)}
              >
                {breadcrumb.name}
              </Button>
            ))}
          </Breadcrumbs>
          <Title className="text-2xl font-bold">{currentFolder?.name ?? "Video Library"}</Title>
        </Group>
        <Group>
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreateFolderPrompt}>
            New Folder
          </Button>
          <Button
            variant="light"
            leftSection={<IconTrash size={16} />}
            onClick={() => setCurrentView("trash")}
          >
            Trash
          </Button>
          <VideoViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </Group>
      </Group>

      {displayFolders.length > 0 && (
        <Box mb="xl">
          <Text fw={600} size="sm" c="dimmed" mb="sm">
            Folders
          </Text>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayFolders.map((folder) => (
              <Card
                key={folder.id}
                withBorder
                padding="md"
                radius="md"
                className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => navigateToFolder(folder.id, folder.name)}
              >
                <Group justify="space-between">
                  <Group gap="xs">
                    <IconFolder size={20} className="text-blue-500" />
                    <Text fw={500} truncate>
                      {folder.name}
                    </Text>
                  </Group>
                </Group>
              </Card>
            ))}
          </div>
        </Box>
      )}

      <Box>
        <Text fw={600} size="sm" c="dimmed" mb="sm">
          Videos
        </Text>
        <VideosList
          videos={displayVideos}
          viewMode={viewMode}
          onVideoSelect={handleVideoSelect}
          onVideoDoubleClick={handleVideoDoubleClick}
          selectedVideoId={selectedVideoId}
        />
      </Box>
    </Box>
  );
}
