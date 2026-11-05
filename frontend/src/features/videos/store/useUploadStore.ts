import { create } from "zustand";
import { uploadVideo } from "@/features/videos/api/uploadVideo";
import { isAbortError } from "@/features/videos/api/uploadParts";
import { moveLibraryItem } from "@/features/folders/api/folders";

export type UploadStatus = "queued" | "uploading" | "completed" | "error" | "cancelled";

export interface UploadTask {
  id: string;
  file: File;
  title: string;
  notes: string;
  targetFolderID?: string | null;
  progress: number; // 0..1
  status: UploadStatus;
  error?: string | null;
  abortController?: AbortController;
}

interface UploadStoreState {
  tasks: UploadTask[];
  concurrencyLimit: number;
  enqueueUpload: (task: {
    file: File;
    title: string;
    notes: string;
    targetFolderID?: string | null;
  }) => string;
  cancelUpload: (id: string) => void;
  removeTask: (id: string) => void;
  clearCompleted: () => void;
  processQueue: () => void;
  onSuccessCallback?: () => void;
  setOnSuccessCallback: (cb: () => void) => void;
}

export const useUploadStore = create<UploadStoreState>((set, get) => ({
  tasks: [],
  concurrencyLimit: 2,
  onSuccessCallback: undefined,
  setOnSuccessCallback: (cb) => set({ onSuccessCallback: cb }),

  enqueueUpload: ({ file, title, notes, targetFolderID }) => {
    const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const newTask: UploadTask = {
      id,
      file,
      title: title || file.name,
      notes,
      targetFolderID,
      progress: 0,
      status: "queued",
    };

    set((state) => ({ tasks: [...state.tasks, newTask] }));

    setTimeout(() => {
      get().processQueue();
    }, 0);

    return id;
  },

  cancelUpload: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task && task.abortController) {
      task.abortController.abort();
    }
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: "cancelled", error: "Upload cancelled." } : t,
      ),
    }));
    setTimeout(() => {
      get().processQueue();
    }, 0);
  },

  removeTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  clearCompleted: () => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.status === "uploading" || t.status === "queued"),
    }));
  },

  processQueue: () => {
    const { tasks, concurrencyLimit } = get();
    const activeCount = tasks.filter((t) => t.status === "uploading").length;

    if (activeCount >= concurrencyLimit) {
      return;
    }

    const nextTask = tasks.find((t) => t.status === "queued");
    if (!nextTask) {
      return;
    }

    const abortController = new AbortController();

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === nextTask.id ? { ...t, status: "uploading", abortController } : t,
      ),
    }));

    uploadVideo({
      file: nextTask.file,
      title: nextTask.title,
      notes: nextTask.notes,
      signal: abortController.signal,
      onProgress: (fraction) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === nextTask.id ? { ...t, progress: fraction } : t)),
        }));
      },
    })
      .then(async (uploadedVideo) => {
        if (nextTask.targetFolderID && uploadedVideo) {
          try {
            await moveLibraryItem({
              item_id: uploadedVideo.id,
              item_type: "video",
              target_folder_id: nextTask.targetFolderID,
            });
          } catch (e) {
            console.error("Failed to move uploaded video into target folder:", e);
          }
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === nextTask.id ? { ...t, status: "completed", progress: 1 } : t,
          ),
        }));

        const cb = get().onSuccessCallback;
        if (cb) cb();
      })
      .catch((err) => {
        if (isAbortError(err)) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === nextTask.id ? { ...t, status: "cancelled", error: "Upload cancelled." } : t,
            ),
          }));
        } else {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === nextTask.id
                ? {
                    ...t,
                    status: "error",
                    error: err instanceof Error ? err.message : "Upload failed.",
                  }
                : t,
            ),
          }));
        }
      })
      .finally(() => {
        get().processQueue();
      });
  },
}));
