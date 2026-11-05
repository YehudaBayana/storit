import { useState, useMemo } from "react";
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
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";
import { useFolderKeyboardShortcuts } from "../hooks/useFolderKeyboardShortcuts";
import { useFolderUpload } from "../hooks/useFolderUpload";
import { useFolderBreadcrumbs } from "../hooks/useFolderBreadcrumbs";

export function useFolderViewLogic() {
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

  const [moveItem, setMoveItem] = useState<LibraryItem | null>(null);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

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

  const handleMoveItemTo = (item: LibraryItem, targetFolderId: string | null) => {
    if (viewTrash) return;
    if (item.parent_id === targetFolderId || (!item.parent_id && !targetFolderId)) {
      return;
    }
    const targetFolder = foldersData?.find((f) => f.id === targetFolderId);
    const targetName = targetFolder ? targetFolder.name : "Home";
    moveItemMut.mutate(
      {
        item_id: item.id,
        item_type: item.type,
        target_folder_id: targetFolderId,
        version: item.version,
      },
      {
        onSuccess: () => {
          showToast(`Moved "${item.name}" to "${targetName}"`);
        },
        onError: (err: Error) => {
          showErrorToast(err?.message || "Failed to move item");
        },
      },
    );
  };

  const availableFolders = (foldersData || []).filter((f) => {
    if (moveItem && moveItem.type === "folder" && f.id === moveItem.id) return false;
    return !f.is_trash;
  });

  const selectData = [
    { value: "root", label: "Home (Root Folder)" },
    ...availableFolders.map((f) => ({ value: f.id, label: f.name })),
  ];

  const handleConfirmMove = () => {
    if (!moveItem) return;
    const finalTargetId = targetFolderId === "root" ? null : targetFolderId;
    handleMoveItemTo(moveItem, finalTargetId);
    setMoveItem(null);
  };

  const handleDropOnFolder = (draggedItem: LibraryItem, targetFolder: LibraryItem) => {
    if (viewTrash) return;
    moveItemMut.mutate(
      {
        item_id: draggedItem.id,
        item_type: draggedItem.type,
        target_folder_id: targetFolder.id,
        version: draggedItem.version,
      },
      {
        onSuccess: () => {
          showToast(`Moved "${draggedItem.name}" to "${targetFolder.name}"`);
        },
        onError: (err: Error) => {
          showErrorToast(err?.message || "Failed to move item");
        },
      },
    );
  };

  const pathSegments = viewTrash ? [{ id: null, name: "Trash" }] : computedBreadcrumbs;

  const handleDropOnBreadcrumb = (draggedItem: LibraryItem, targetFolderId: string | null) => {
    if (viewTrash) return;
    if (draggedItem.parent_id === targetFolderId || (!draggedItem.parent_id && !targetFolderId)) {
      return;
    }
    const targetName =
      pathSegments.find((segment) => segment.id === targetFolderId)?.name || "Folder";
    moveItemMut.mutate(
      {
        item_id: draggedItem.id,
        item_type: draggedItem.type,
        target_folder_id: targetFolderId,
        version: draggedItem.version,
      },
      {
        onSuccess: () => {
          showToast(`Moved "${draggedItem.name}" to "${targetName}"`);
        },
        onError: (err: Error) => {
          showErrorToast(err?.message || "Failed to move item");
        },
      },
    );
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

  return {
    viewTrash,
    items,
    isLoading,
    selectedIDs,
    cutIDs,
    renameFolderID,
    renameValue,
    setRenameValue,
    createModalOpen,
    setCreateModalOpen,
    newFolderName,
    setNewFolderName,
    videoToDelete,
    setVideoToDelete,
    moveItem,
    setMoveItem,
    targetFolderId,
    setTargetFolderId,
    selectData,
    foldersData,
    uploadHook,
    pathSegments,
    deleteVideoMutation,
    emptyTrashMut,
    deleteFolderMut,
    restoreItemMut,
    setSelectedIDs,
    handleCreate,
    handleRename,
    setRenameFolderID,
    selectItem,
    navigateToFolder,
    handleMoveItemTo,
    handleConfirmMove,
    handleDropOnFolder,
    handleDropOnBreadcrumb,
    openItem,
  };
}
