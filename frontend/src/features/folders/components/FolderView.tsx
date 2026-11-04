"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Group,
  Text,
  Button,
  Stack,
  Menu,
  TextInput,
  Modal,
  Box,
  Select,
  Progress,
  Alert,
  Divider,
} from "@mantine/core";
import { FiChevronRight, FiTrash2, FiEdit2, FiCornerUpRight } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useFolders,
  useFolderContents,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useMoveLibraryItem,
  useTrashItems,
  useRestoreLibraryItem,
  useEmptyTrash,
  folderKeys,
} from "../query/useFolders";
import { LibraryItem } from "../api/folders";
import { LibraryItemTile } from "./LibraryItemTile";
import { useUploadVideo } from "@/features/videos/query/useVideos";
import { isAbortError } from "@/features/videos/api/uploadParts";
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export function FolderView() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const playVideo = useVideoPlayerStore((state) => state.playVideo);
  const searchParams = useSearchParams();

  const currentFolderID = searchParams.get("id");
  const viewTrash = searchParams.get("trash") === "true";
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "My Library" },
  ]);
  const [newFolderName, setNewFolderName] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [renameFolderID, setRenameFolderID] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [selectedIDs, setSelectedIDs] = useState<Set<string>>(new Set());
  const [cutIDs, setCutIDs] = useState<Set<string>>(new Set());

  // Upload states using multipart hook
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [targetFolderIDForUpload, setTargetFolderIDForUpload] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const uploadVideoMutation = useUploadVideo();

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

  // Handle browser popstate / back / forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      setSelectedIDs(new Set());
      const historyBreadcrumbs = event.state?.breadcrumbs as BreadcrumbItem[] | undefined;
      if (historyBreadcrumbs) {
        setBreadcrumbs(historyBreadcrumbs);
      } else if (new URLSearchParams(window.location.search).get("id")) {
        const folderId = new URLSearchParams(window.location.search).get("id");
        const folder = foldersData?.find((item) => item.id === folderId);
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
  }, [foldersData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
        e.preventDefault();
        setSelectedIDs(new Set(items.map((i) => i.id)));
      } else if (e.key === "Escape") {
        setRenameFolderID(null);
        setSelectedIDs(new Set());
        setCutIDs(new Set());
      } else if ((e.metaKey || e.ctrlKey) && e.key === "x") {
        if (selectedIDs.size > 0) {
          setCutIDs(new Set(selectedIDs));
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === "v") {
        if (cutIDs.size > 0) {
          cutIDs.forEach((id) => {
            const item = items.find((i) => i.id === id);
            if (item) {
              moveItemMut.mutate({
                item_id: item.id,
                item_type: item.type,
                target_folder_id: currentFolderID,
              });
            }
          });
          setCutIDs(new Set());
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIDs, cutIDs, currentFolderID, moveItemMut]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setUploadFile(selectedFile);
    if (selectedFile) {
      setUploadTitle((current) => current || selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("Select a video file to upload.");
      return;
    }

    setUploadError(null);
    setUploadProgress(0);
    const uploadAbort = new AbortController();
    uploadAbortRef.current = uploadAbort;

    const destFolder = targetFolderIDForUpload !== null ? targetFolderIDForUpload : currentFolderID;

    try {
      const uploadedVideo = await uploadVideoMutation.mutateAsync({
        file: uploadFile,
        title: uploadTitle || uploadFile.name,
        notes: uploadNotes,
        signal: uploadAbort.signal,
        onProgress: setUploadProgress,
      });

      if (destFolder && uploadedVideo) {
        await moveItemMut.mutateAsync({
          item_id: uploadedVideo.id,
          item_type: "video",
          target_folder_id: destFolder,
        });
      }

      setUploadFile(null);
      setUploadTitle("");
      setUploadNotes("");
      setUploadModalOpen(false);
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    } catch (submitError) {
      if (isAbortError(submitError)) {
        setUploadError("Upload cancelled.");
      } else {
        setUploadError(submitError instanceof Error ? submitError.message : "Upload failed.");
      }
    } finally {
      uploadAbortRef.current = null;
    }
  };

  const handleRename = (id: string) => {
    if (!renameValue.trim()) return;
    updateFolderMut.mutate(
      { id, patch: { name: renameValue } },
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

    const url = folderId ? `/folders?id=${folderId}` : `/folders`;
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
    window.history.pushState({ folderId, breadcrumbs: nextBreadcrumbs }, "", url);
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

  const renderItemMenu = (item: LibraryItem) => {
    if (viewTrash) {
      return (
        <Menu.Item
          leftSection={<FiCornerUpRight size={14} />}
          onClick={() => restoreItemMut.mutate({ item_id: item.id, item_type: item.type })}
        >
          Restore
        </Menu.Item>
      );
    }
    return (
      <>
        {item.type === "folder" && (
          <Menu.Item
            leftSection={<FiEdit2 size={14} />}
            onClick={() => {
              setRenameFolderID(item.id);
              setRenameValue(item.name);
            }}
          >
            Rename
          </Menu.Item>
        )}
        <Menu.Item
          leftSection={<FiTrash2 size={14} />}
          color="red"
          onClick={() => {
            if (item.type === "folder") {
              deleteFolderMut.mutate(item.id);
            }
          }}
        >
          Move to Trash
        </Menu.Item>
      </>
    );
  };

  const pathSegments = viewTrash ? [{ id: null, name: "Trash" }] : visibleBreadcrumbs;

  return (
    <Stack gap={0} h="100%" onClick={() => setSelectedIDs(new Set())}>
      <Group justify="space-between" px="md" py="xs" onClick={(e) => e.stopPropagation()}>
        <Group gap={2}>
          {pathSegments.map((segment, index) => (
            <Group key={segment.id ?? "root"} gap={2}>
              {index > 0 && <FiChevronRight size={12} />}
              <Button
                variant="subtle"
                color="gray"
                size="compact-sm"
                fw={index === pathSegments.length - 1 ? 600 : 400}
                disabled={viewTrash}
                onClick={() => navigateToFolder(segment.id, segment.name)}
              >
                {segment.name}
              </Button>
            </Group>
          ))}
        </Group>
        {!viewTrash && (
          <Group gap="xs">
            <Button
              variant="subtle"
              color="gray"
              size="compact-sm"
              onClick={() => {
                setTargetFolderIDForUpload(currentFolderID);
                setUploadModalOpen(true);
              }}
            >
              Upload
            </Button>
            <Button
              variant="subtle"
              color="gray"
              size="compact-sm"
              onClick={() => setCreateModalOpen(true)}
            >
              New Folder
            </Button>
          </Group>
        )}
        {viewTrash && items.length > 0 && (
          <Button
            color="red"
            variant="subtle"
            size="compact-sm"
            onClick={() => emptyTrashMut.mutate()}
          >
            Empty Trash
          </Button>
        )}
      </Group>
      <Divider />

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
              menuContent={renderItemMenu(item)}
              onRenameValueChange={setRenameValue}
              onRenameSubmit={() => handleRename(item.id)}
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

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Folder"
      >
        <form onSubmit={handleCreate}>
          <Stack gap="md">
            <TextInput
              label="Folder Name"
              placeholder="My Folder"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              data-autofocus
              required
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Video to Folder"
      >
        <form onSubmit={handleUploadSubmit}>
          <Stack gap="md">
            <TextInput
              label="Video Title"
              placeholder="My Video"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
            <TextInput
              label="Notes"
              placeholder="Optional notes"
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
            />
            <Select
              label="Target Folder"
              data={folderOptions}
              value={targetFolderIDForUpload ?? ""}
              onChange={(val) => setTargetFolderIDForUpload(val || null)}
            />
            <div>
              <Text size="sm" fw={500} mb={4}>
                Video File
              </Text>
              <input
                type="file"
                accept="video/*,.mp4,.mov,.avi,.webm,.mkv,.m4v"
                onChange={handleFileChange}
                required
              />
            </div>

            {uploadError && <Alert color="red" title={uploadError} />}

            {uploadVideoMutation.isPending && (
              <Stack gap="sm">
                <Progress value={Math.round(uploadProgress * 100)} />
                <Text size="sm">
                  Uploading {Math.round(uploadProgress * 100)}%. Keep this tab open.
                </Text>
              </Stack>
            )}

            <Group justify="flex-end">
              {uploadVideoMutation.isPending ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => uploadAbortRef.current?.abort()}
                >
                  Cancel Upload
                </Button>
              ) : (
                <Button variant="default" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={!uploadFile || uploadVideoMutation.isPending}>
                Upload
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
