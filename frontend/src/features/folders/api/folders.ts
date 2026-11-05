import { apiClient, RequestOptions } from "@/api/apiClient";

export interface Folder {
  id: string;
  owner_id: string;
  parent_id?: string | null;
  name: string;
  is_trash: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

type VideoStatus = "uploading" | "processing" | "ready" | "failed";

export interface LibraryItem {
  id: string;
  type: "folder" | "video";
  name: string;
  parent_id?: string | null;
  version: number;
  created_at: string;
  updated_at: string;
  video?: {
    id: string;
    title: string;
    status: VideoStatus;
    size_bytes: number;
    duration_ms?: number | null;
    thumbnail_key?: string | null;
  };
}

export function listFolders(options?: RequestOptions) {
  return apiClient<Folder[]>("/api/folders", options);
}

export function createFolder(input: { name: string; parent_id?: string | null }) {
  return apiClient<Folder>("/api/folders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateFolder(
  id: string,
  patch: { name?: string; parent_id?: string | null; version?: number },
) {
  return apiClient<Folder>(`/api/folders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteFolder(id: string) {
  return apiClient<void>(`/api/folders/items/${id}?type=folder`, {
    method: "DELETE",
  });
}

export function getFolderContents(id: string, options?: RequestOptions) {
  return apiClient<LibraryItem[]>(`/api/folders/${id}/contents`, options);
}

export function moveLibraryItem(input: {
  item_id: string;
  item_type: "folder" | "video";
  target_folder_id?: string | null;
  version?: number;
}) {
  return apiClient<void>("/api/library/move", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getTrashItems(options?: RequestOptions) {
  return apiClient<LibraryItem[]>("/api/library/trash", options);
}

export function restoreLibraryItem(input: { item_id: string; item_type: "folder" | "video" }) {
  return apiClient<void>("/api/library/restore", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function emptyTrashBin() {
  return apiClient<void>("/api/library/trash", {
    method: "DELETE",
  });
}
