"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Text, Stack, Box, Group } from "@mantine/core";
import { useRouter, useSearchParams, useParams } from "next/navigation";
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
import { LibraryItemTile } from "./LibraryItemTile";
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";
import { FolderBreadcrumbsHeader, BreadcrumbItem } from "./FolderBreadcrumbsHeader";
import { CreateFolderModal } from "./CreateFolderModal";
import { UploadVideoModal } from "./UploadVideoModal";
import { FolderItemMenu } from "./FolderItemMenu";
import { useFolderKeyboardShortcuts } from "../hooks/useFolderKeyboardShortcuts";
import { useFolderUpload } from "../hooks/useFolderUpload";

export function FolderView() {
  const router = useRouter();
  const playVideo = useVideoPlayerStore((state) => state.playVideo);
  const searchParams = useSearchParams();
  const params = useParams<{ id?: string }>();

  const folderIdFromParam = params?.id ? decodeURIComponent(params.id) : null;
  const currentFolderID = folderIdFromParam || searchParams.get("id");
  const viewTrash = searchParams.get("trash") === "true";

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "My Library" },
  ]);
  const [newFolderName, setNewFolderName] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [renameFolderID, setRenameFolderID] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [selectedIDs, setSelectedIDs] = useState<Set<string>>(new Set());
  const [cutIDs, setCutIDs] = useState<Set<string>>(new Set());

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

  const items: LibraryItem[] = useMemo(() => {
    return viewTrash ? (trashData ?? []) : (contentsData ?? []);
  }, [viewTrash, trashData, contentsData]);

  const currentFolderFromList = foldersData?.find((folder) => folder.id === currentFolderID);
  const breadcrumbsMatchFolder =
    currentFolderID === null
      ? breadcrumbs.length === 1 && breadcrumbs[0].id === null
      : breadcrumbs.at(-1)?.id === currentFolderID;
  const visibleBreadcrumbs = breadcrumbsMatchFolder
    ? breadcrumbs
    : currentFolderID && currentFolderFromList
      ? [
          { id: null, name: "My Library" },
          { id: currentFolderFromList.id, name: currentFolderFromList.name },
        ]
      : [{ id: null, name: "My Library" }];

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

  // Handle browser popstate / back / forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      setSelectedIDs(new Set());
      const historyBreadcrumbs = event.state?.breadcrumbs as BreadcrumbItem[] | undefined;
      if (historyBreadcrumbs) {
        setBreadcrumbs(historyBreadcrumbs);
      } else if (currentFolderID) {
        const folder = foldersData?.find((item) => item.id === currentFolderID);
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
  }, [foldersData, currentFolderID]);

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

  const folderOptions = [
    { value: "", label: "My Library (Root)" },
    ...(foldersData ?? []).map((f) => ({ value: f.id, label: f.name })),
  ];

  const navigateToFolder = (folderId: string | null, folderName: string) => {
    if (folderId === currentFolderID && !viewTrash) {
      return;
    }

    const url = folderId ? `/folders/${folderId}` : `/folders`;
    let nextBreadcrumbs: BreadcrumbItem[];

    if (folderId === null) {
      nextBreadcrumbs = [{ id: null, name: "My Library" }];
    } else {
      const idx = visibleBreadcrumbs.findIndex((b) => b.id === folderId);
      if (idx !== -1) {
        nextBreadcrumbs = visibleBreadcrumbs.slice(0, idx + 1);
      } else {
        nextBreadcrumbs = [...visibleBreadcrumbs, { id: folderId, name: folderName }];
      }
    }
    setBreadcrumbs(nextBreadcrumbs);
    setSelectedIDs(new Set());
    router.push(url);
  };

  const openItem = (item: LibraryItem) => {
    if (viewTrash) return;
    if (item.type === "folder") {
      navigateToFolder(item.id, item.name);
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

  const pathSegments = viewTrash ? [{ id: null, name: "Trash" }] : visibleBreadcrumbs;

  return (
    <Stack gap={0} h="100%" onClick={() => setSelectedIDs(new Set())}>
      <FolderBreadcrumbsHeader
        pathSegments={pathSegments}
        viewTrash={viewTrash}
        hasTrashItems={items.length > 0}
        onNavigate={navigateToFolder}
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
        targetFolderID={uploadHook.targetFolderID}
        onTargetFolderIDChange={uploadHook.setTargetFolderID}
        folderOptions={folderOptions}
        onFileChange={uploadHook.handleFileChange}
        error={uploadHook.uploadError}
        isUploading={uploadHook.isUploading}
        progress={uploadHook.uploadProgress}
        onCancelUpload={uploadHook.cancelUpload}
        onSubmit={uploadHook.handleUploadSubmit}
        fileSelected={Boolean(uploadHook.uploadFile)}
      />
    </Stack>
  );
}
