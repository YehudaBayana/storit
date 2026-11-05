import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderContents,
  moveLibraryItem,
  getTrashItems,
  restoreLibraryItem,
  emptyTrashBin,
} from "../api/folders";
import { folderKeys, videoKeys } from "@/shared/api/keys";

export { folderKeys };

export function useFolders() {
  return useQuery({
    queryKey: folderKeys.lists(),
    queryFn: () => listFolders(),
  });
}

export function useFolderContents(folderId: string | null) {
  const effectiveId = folderId ?? "root";
  return useQuery({
    queryKey: folderKeys.contents(effectiveId),
    queryFn: () => getFolderContents(effectiveId),
  });
}

export function useTrashItems() {
  return useQuery({
    queryKey: folderKeys.trash(),
    queryFn: () => getTrashItems(),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: { name?: string; parent_id?: string | null; version?: number };
    }) => updateFolder(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

export function useMoveLibraryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moveLibraryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
    },
  });
}

export function useRestoreLibraryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreLibraryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
    },
  });
}

export function useEmptyTrash() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: emptyTrashBin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
    },
  });
}
