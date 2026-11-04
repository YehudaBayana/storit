import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUploadVideo } from "@/features/videos/query/useVideos";
import { isAbortError } from "@/features/videos/api/uploadParts";
import { useMoveLibraryItem, folderKeys } from "../query/useFolders";

export function useFolderUpload(currentFolderID: string | null) {
  const queryClient = useQueryClient();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [targetFolderID, setTargetFolderID] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);

  const uploadVideoMutation = useUploadVideo();
  const moveItemMut = useMoveLibraryItem();

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

    const destFolder = targetFolderID !== null ? targetFolderID : currentFolderID;

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

  const openUploadModal = () => {
    setTargetFolderID(currentFolderID);
    setUploadModalOpen(true);
  };

  const cancelUpload = () => {
    uploadAbortRef.current?.abort();
  };

  return {
    uploadModalOpen,
    setUploadModalOpen,
    uploadFile,
    uploadTitle,
    setUploadTitle,
    uploadNotes,
    setUploadNotes,
    targetFolderID,
    setTargetFolderID,
    uploadProgress,
    uploadError,
    isUploading: uploadVideoMutation.isPending,
    handleFileChange,
    handleUploadSubmit,
    openUploadModal,
    cancelUpload,
  };
}
