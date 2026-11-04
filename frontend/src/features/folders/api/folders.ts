import { apiClient, RequestOptions } from "@/api/apiClient";
import { getCookie } from "@/features/auth/utils";

export interface Folder {
  id: string;
  owner_id: string;
  parent_id?: string | null;
  name: string;
  is_trash: boolean;
  created_at: string;
  updated_at: string;
}

type VideoStatus = "uploading" | "processing" | "ready" | "failed";

export interface LibraryItem {
  id: string;
  type: "folder" | "video";
  name: string;
  parent_id?: string | null;
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

interface LibraryItemResponse extends Omit<LibraryItem, "type"> {
  type?: "folder" | "video";
  item_type?: "folder" | "media";
  media_type?: string;
  status?: VideoStatus;
}

export function listFolders(options?: RequestOptions) {
  return apiClient<Folder[]>("/api/folders", {
    credentials: "include",
    ...options,
  });
}

export function createFolder(input: { name: string; parent_id?: string | null }) {
  return apiClient<Folder>("/api/folders", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-Token": getCookie("csrf_token") ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export function updateFolder(id: string, patch: { name?: string; parent_id?: string | null }) {
  return apiClient<Folder>(`/api/folders/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "X-CSRF-Token": getCookie("csrf_token") ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });
}

export function deleteFolder(id: string) {
  return apiClient<void>(`/api/folders/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-CSRF-Token": getCookie("csrf_token") ?? "",
    },
  });
}

export function getFolderContents(id: string, options?: RequestOptions) {
  return apiClient<LibraryItemResponse[]>(`/api/folders/${id}/contents`, {
    credentials: "include",
    ...options,
  }).then((items) =>
    items.map((item) => ({
      ...item,
      type: item.type ?? (item.item_type === "folder" ? "folder" : "video"),
      video:
        item.video ??
        (item.item_type === "media"
          ? {
              id: item.id,
              title: item.name,
              status: item.status ?? "ready",
              size_bytes: 0,
            }
          : undefined),
    })),
  );
}

export function moveLibraryItem(input: {
  item_id: string;
  item_type: "folder" | "video";
  target_folder_id?: string | null;
}) {
  return apiClient<void>("/api/library/move", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-Token": getCookie("csrf_token") ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export function getTrashItems(options?: RequestOptions) {
  return apiClient<LibraryItem[]>("/api/library/trash", {
    credentials: "include",
    ...options,
  });
}

export function restoreLibraryItem(input: { item_id: string; item_type: "folder" | "video" }) {
  return apiClient<void>("/api/library/restore", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-Token": getCookie("csrf_token") ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export function emptyTrashBin() {
  return apiClient<void>("/api/library/trash", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-CSRF-Token": getCookie("csrf_token") ?? "",
    },
  });
}
