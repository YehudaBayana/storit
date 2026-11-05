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

export interface BackendLibraryItem {
  id: string;
  item_type: "folder" | "media";
  media_type?: string;
  name: string;
  folder_id?: string | null;
  version: number;
  status?: string;
  created_at: string;
  updated_at: string;
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

export async function getFolderContents(
  id: string,
  options?: RequestOptions,
): Promise<LibraryItem[]> {
  const rawItems = await apiClient<BackendLibraryItem[]>(`/api/folders/${id}/contents`, options);
  return (rawItems || []).map((item) => {
    const isFolder = item.item_type === "folder";
    return {
      id: item.id,
      type: isFolder ? "folder" : "video",
      name: item.name,
      parent_id: item.folder_id,
      version: item.version,
      created_at: item.created_at,
      updated_at: item.updated_at,
      video: !isFolder
        ? {
            id: item.id,
            title: item.name,
            status: (item.status as VideoStatus) || "ready",
            size_bytes: 0,
          }
        : undefined,
    };
  });
}

export function moveLibraryItem(input: {
  item_id: string;
  item_type: "folder" | "video";
  target_folder_id?: string | null;
  version?: number;
}) {
  const backendType = input.item_type === "folder" ? "folder" : "media";
  return apiClient<void>("/api/library/move", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      item_type: backendType,
    }),
  });
}

export async function getTrashItems(options?: RequestOptions): Promise<LibraryItem[]> {
  const rawItems = await apiClient<BackendLibraryItem[]>("/api/library/trash", options);
  return (rawItems || []).map((item) => {
    const isFolder = item.item_type === "folder";
    return {
      id: item.id,
      type: isFolder ? "folder" : "video",
      name: item.name,
      parent_id: item.folder_id,
      version: item.version,
      created_at: item.created_at,
      updated_at: item.updated_at,
      video: !isFolder
        ? {
            id: item.id,
            title: item.name,
            status: (item.status as VideoStatus) || "ready",
            size_bytes: 0,
          }
        : undefined,
    };
  });
}

export function restoreLibraryItem(input: { item_id: string; item_type: "folder" | "video" }) {
  const backendType = input.item_type === "folder" ? "folder" : "media";
  return apiClient<void>("/api/library/restore", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      item_type: backendType,
    }),
  });
}

export function emptyTrashBin() {
  return apiClient<void>("/api/library/trash", {
    method: "DELETE",
  });
}
