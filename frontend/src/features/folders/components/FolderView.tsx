"use client";
import React, { useState, useMemo } from "react";
import { Text, Stack, Box, Group, Overlay, Center, Modal, Button } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useFolders,
  useFolderContents,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useMoveLibraryItem,
  useRestoreLibraryItem,
  useEmptyTrash,
  useTrashItems,
} from "../query/useFolders";
import { LibraryItem } from "../api/folders";
import { deleteVideo } from "@/features/videos/api/videos";
import { useToastStore } from "@/store/useToastStore";
import { LibraryItemTile } from "./LibraryItemTile";
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";
import { FolderBreadcrumbsHeader } from "./FolderBreadcrumbsHeader";
import { CreateFolderModal } from "./CreateFolderModal";
import { UploadVideoModal } from "./UploadVideoModal";
import { FolderItemMenu } from "./FolderItemMenu";
import { useFolderKeyboardShortcuts } from "../hooks/useFolderKeyboardShortcuts";
import { useFolderUpload } from "../hooks/useFolderUpload";
import { useFolderBreadcrumbs } from "../hooks/useFolderBreadcrumbs";

export function FolderView() {
  const router = useRouter();
  const playVideo = useVideoPlayerStore((state) => state.playVideo);
  const searchParams = useSearchParams();
  const params = useParams<{ id?: string }>();

  const folderIdFromParam = params?.id ? decodeURIComponent(params.id) : null;
  const currentFolderID = folderIdFromParam || searchParams.get("id");
  const viewTrash = searchParams.get("trash") === "true";

  const [newFolderName, setNewFolderName] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [renameFolderID, setRenameFolderID] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [selectedIDs, setSelectedIDs] = useState<Set<string>>(new Set());
  const [cutIDs, setCutIDs] = useState<Set<string>>(new Set());
  const [videoToDelete, setVideoToDelete] = useState<{ id: string; title: string } | null>(null);

  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.success);
  const showErrorToast = useToastStore((state) => state.error);

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId: string) => deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folderContents"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      showToast("Video deleted successfully");
      setVideoToDelete(null);
    },
    onError: (err: Error) => {
      showErrorToast(err?.message || "Failed to delete video");
    },
  });

  // Track previous folder/trash state to reset selection during render if changed
  const [prevFolderState, setPrevFolderState] = useState({ currentFolderID, viewTrash });
  if (
    prevFolderState.currentFolderID !== currentFolderID ||
    prevFolderState.viewTrash !== viewTrash
  ) {
    setPrevFolderState({ currentFolderID, viewTrash });
    setSelectedIDs(new Set());
  }

  const { data: foldersData } = useFolders();
  const { data: contentsData, isLoading } = useFolderContents(viewTrash ? null : currentFolderID);
  const { data: trashData } = useTrashItems();

  const createFolderMut = useCreateFolder();
  const updateFolderMut = useUpdateFolder();
  const deleteFolderMut = useDeleteFolder();
  const moveItemMut = useMoveLibraryItem();
  const restoreItemMut = useRestoreLibraryItem();
  const emptyTrashMut = useEmptyTrash();

  const computedBreadcrumbs = useFolderBreadcrumbs(currentFolderID, foldersData);

  const rawItems: LibraryItem[] = useMemo(() => {
    return viewTrash ? (trashData ?? []) : (contentsData ?? []);
  }, [viewTrash, trashData, contentsData]);

  const items: LibraryItem[] = useMemo(() => {
    return [...rawItems].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [rawItems]);

  const uploadHook = useFolderUpload(currentFolderID);

  useFolderKeyboardShortcuts({
    items,
    selectedIDs,
    cutIDs,
    currentFolderID,
    setSelectedIDs,
    setCutIDs,
    onCancelRename: () => setRenameFolderID(null),
    onMoveItem: (params) => moveItemMut.mutate(params),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolderMut.mutate(
      { name: newFolderName, parent_id: currentFolderID },
      {
        onSuccess: () => {
          setNewFolderName("");
          setCreateModalOpen(false);
        },
      },
    );
  };

  const handleRename = (item: LibraryItem) => {
    if (!renameValue.trim()) return;
    updateFolderMut.mutate(
      { id: item.id, patch: { name: renameValue, version: item.version } },
      {
        onSuccess: () => {
          setRenameFolderID(null);
          setRenameValue("");
        },
      },
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIDs((currentSelection) => {
      const nextSelection = new Set(currentSelection);
      if (nextSelection.has(id)) {
        nextSelection.delete(id);
      } else {
        nextSelection.add(id);
      }
      return nextSelection;
    });
  };

  const selectItem = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      toggleSelect(id);
      return;
    }
    setSelectedIDs(new Set([id]));
  };

  const navigateToFolder = (folderId: string | null) => {
    if (folderId === currentFolderID && !viewTrash) {
      return;
    }

    const url = folderId ? `/folders/${folderId}` : `/folders`;
    setSelectedIDs(new Set());
    router.push(url);
  };

  const openItem = (item: LibraryItem) => {
    if (viewTrash) return;
    if (item.type === "folder") {
      navigateToFolder(item.id);
      return;
    }
    const mediaId = item.video?.id ?? item.id;
    playVideo({
      id: mediaId,
      owner_id: "",
      title: item.name,
      notes: "",
      status: item.video?.status ?? "ready",
      original_name: item.name,
      original_key: "",
      size_bytes: item.video?.size_bytes ?? 0,
      thumbnail_key: item.video?.thumbnail_key,
      duration_ms: item.video?.duration_ms,
      created_at: item.created_at,
      updated_at: item.updated_at,
    });
    router.push(`/videos/${mediaId}`);
  };

  const pathSegments = viewTrash ? [{ id: null, name: "Trash" }] : computedBreadcrumbs;

  return (
    <>
      <Dropzone.FullScreen
        active={!viewTrash}
        accept={[MIME_TYPES.mp4]}
        onDrop={(files) => uploadHook.handleDropFiles(files)}
      >
        <Overlay color="#000" backgroundOpacity={0.65} zIndex={9999} fixed>
          <Center style={{ width: "100%", height: "100%" }}>
            <Text size="xl" fw={700} c="white">
              drop to upload the video&apos;s
            </Text>
          </Center>
        </Overlay>
      </Dropzone.FullScreen>

      <Stack gap={0} h="100%" onClick={() => setSelectedIDs(new Set())}>
        <FolderBreadcrumbsHeader
          pathSegments={pathSegments}
          viewTrash={viewTrash}
          hasTrashItems={items.length > 0}
          onNavigate={(folderId) => navigateToFolder(folderId)}
          onOpenUpload={() => uploadHook.openUploadModal()}
          onOpenCreateFolder={() => setCreateModalOpen(true)}
          onEmptyTrash={() => emptyTrashMut.mutate()}
        />

        {cutIDs.size > 0 && (
          <Text size="xs" c="dimmed" px="md" pt="xs">
            {cutIDs.size} item(s) cut. Press Cmd/Ctrl+V in the target folder to paste.
          </Text>
        )}

        <Box p="md" style={{ flex: 1 }}>
          <Group gap="xs" align="flex-start">
            {items.map((item) => (
              <LibraryItemTile
                key={item.id}
                item={item}
                isSelected={selectedIDs.has(item.id)}
                isCut={cutIDs.has(item.id)}
                isRenaming={renameFolderID === item.id}
                renameValue={renameValue}
                menuContent={
                  <FolderItemMenu
                    item={item}
                    viewTrash={viewTrash}
                    onRestore={(itm) =>
                      restoreItemMut.mutate({ item_id: itm.id, item_type: itm.type })
                    }
                    onStartRename={(itm) => {
                      setRenameFolderID(itm.id);
                      setRenameValue(itm.name);
                    }}
                    onDeleteFolder={(itm) => {
                      if (itm.type === "folder") {
                        deleteFolderMut.mutate(itm.id);
                      }
                    }}
                    onDeleteVideo={() => {
                      const videoId = item.video?.id ?? item.id;
                      setVideoToDelete({ id: videoId, title: item.name });
                    }}
                  />
                }
                onRenameValueChange={setRenameValue}
                onRenameSubmit={() => handleRename(item)}
                onRenameCancel={() => setRenameFolderID(null)}
                onSelect={(event) => selectItem(item.id, event)}
                onOpen={() => openItem(item)}
              />
            ))}
          </Group>
          {items.length === 0 && !isLoading && (
            <Text c="dimmed" size="sm" ta="center" py="xl">
              {viewTrash ? "Trash is empty." : "This folder is empty."}
            </Text>
          )}
        </Box>

        <CreateFolderModal
          opened={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          folderName={newFolderName}
          onFolderNameChange={setNewFolderName}
          onSubmit={handleCreate}
        />

        <UploadVideoModal
          opened={uploadHook.uploadModalOpen}
          onClose={() => uploadHook.setUploadModalOpen(false)}
          title={uploadHook.uploadTitle}
          onTitleChange={uploadHook.setUploadTitle}
          notes={uploadHook.uploadNotes}
          onNotesChange={uploadHook.setUploadNotes}
          onFileChange={uploadHook.handleFileChange}
          error={uploadHook.uploadError}
          isUploading={uploadHook.isUploading}
          progress={uploadHook.uploadProgress}
          onCancelUpload={uploadHook.cancelUpload}
          onSubmit={uploadHook.handleUploadSubmit}
          fileSelected={Boolean(uploadHook.uploadFile)}
        />

        <Modal
          opened={Boolean(videoToDelete)}
          onClose={() => setVideoToDelete(null)}
          title="Delete Video"
          centered
          onClick={(e) => e.stopPropagation()}
        >
          <Text size="sm" mb="lg">
            Are you sure you want to delete &quot;{videoToDelete?.title}&quot;? This will remove the
            video from your database and permanently delete its media files from storage.
          </Text>
          <Group justify="end">
            <Button variant="default" onClick={() => setVideoToDelete(null)}>
              Cancel
            </Button>
            <Button
              color="red"
              loading={deleteVideoMutation.isPending}
              onClick={() => {
                if (videoToDelete) {
                  deleteVideoMutation.mutate(videoToDelete.id);
                }
              }}
            >
              Delete
            </Button>
          </Group>
        </Modal>
      </Stack>
    </>
  );
}
