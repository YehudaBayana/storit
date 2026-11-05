import { useState, useRef } from "react";
import { useUploadVideo } from "@/features/videos/query/useVideos";
import { useMoveLibraryItem } from "../query/useFolders";
import { useUploadStore } from "@/features/videos/store/useUploadStore";

export function useFolderUpload(currentFolderID: string | null) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [targetFolderID, setTargetFolderID] = useState<string | null>(null);
  const [uploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);

  const uploadVideoMutation = useUploadVideo();
  const moveItemMut = useMoveLibraryItem();
  const enqueueUpload = useUploadStore((state) => state.enqueueUpload);

  const handleDropFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    for (const f of files) {
      enqueueUpload({
        file: f,
        title: f.name.replace(/\.[^/.]+$/, ""),
        notes: "",
        targetFolderID: currentFolderID,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFilesList = Array.from(e.target.files ?? []);
    setUploadFiles(selectedFilesList);
    const selected = selectedFilesList[0] ?? null;
    setUploadFile(selected);
    setSelectedFile(selected);
    if (selected) {
      setUploadTitle((current) => current || selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filesToUpload =
      uploadFiles.length > 0
        ? uploadFiles
        : uploadFile
          ? [uploadFile]
          : selectedFile
            ? [selectedFile]
            : [];

    if (filesToUpload.length === 0) {
      setUploadError("Select a video file to upload.");
      return;
    }

    setUploadError(null);
    const destFolder = targetFolderID !== null ? targetFolderID : currentFolderID;

    for (const f of filesToUpload) {
      enqueueUpload({
        file: f,
        title:
          filesToUpload.length === 1 && uploadTitle ? uploadTitle : f.name.replace(/\.[^/.]+$/, ""),
        notes: uploadNotes,
        targetFolderID: destFolder,
      });
    }

    setUploadFile(null);
    setSelectedFile(null);
    setUploadFiles([]);
    setUploadTitle("");
    setUploadNotes("");
    setUploadModalOpen(false);
  };

  const openUploadModal = () => {
    setTargetFolderID(currentFolderID);
    setUploadModalOpen(true);
  };

  const cancelUpload = () => {
    uploadAbortRef.current?.abort();
  };

  const uploadedVideo = null;

  return {
    uploadModalOpen,
    setUploadModalOpen,
    uploadFile,
    selectedFile,
    uploadTitle,
    setUploadTitle,
    uploadNotes,
    setUploadNotes,
    targetFolderID,
    setTargetFolderID,
    uploadProgress,
    uploadError,
    isUploading: uploadVideoMutation.isPending,
    handleDropFiles,
    handleFileChange,
    handleUploadSubmit,
    openUploadModal,
    cancelUpload,
    moveItemMut,
    uploadAbortRef,
    uploadVideoMutation,
    uploadedVideo,
  };
}
