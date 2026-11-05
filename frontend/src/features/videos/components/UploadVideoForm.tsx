"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Grid, Stack, Alert, Button, Flex, Input, Text, Textarea } from "@mantine/core";
import { useUploadVideo } from "@/features/videos/query/useVideos";
import { useUploadStore } from "@/features/videos/store/useUploadStore";

export function UploadVideoForm() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const uploadVideoMutation = useUploadVideo();
  const enqueueUpload = useUploadStore((state) => state.enqueueUpload);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    setFiles(selectedFiles);
    const first = selectedFiles[0] ?? null;
    setFile(first);
    setSelectedFile(first);
    if (first) {
      setTitle((current) => current || first.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const uploadFiles =
      files.length > 0 ? files : file ? [file] : selectedFile ? [selectedFile] : [];

    if (uploadFiles.length === 0) {
      setError("Select a video file to upload.");
      return;
    }

    setError(null);

    for (const f of uploadFiles) {
      enqueueUpload({
        file: f,
        title: uploadFiles.length === 1 && title ? title : f.name.replace(/\.[^/.]+$/, ""),
        notes,
      });
    }

    setTitle("");
    setNotes("");
    setFile(null);
    setFiles([]);
    setSelectedFile(null);
    const fileInput = document.getElementById("video-upload-input") as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Grid columns={2} gap="lg">
          <Grid.Col span={2}>
            <Input.Wrapper label="Video file(s)">
              <Input
                id="video-upload-input"
                type="file"
                multiple
                accept="video/*,.mp4,.mov,.avi,.webm,.mkv,.m4v"
                onChange={handleFileChange}
              />
            </Input.Wrapper>
          </Grid.Col>

          <Grid.Col span={2}>
            <Input.Wrapper label="Title">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Sunrise drill"
              />
            </Input.Wrapper>
          </Grid.Col>

          <Grid.Col span={2}>
            <Input.Wrapper label="Notes">
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="What improved today?"
              />
            </Input.Wrapper>
          </Grid.Col>
        </Grid>

        {error && <Alert title={error} variant="error" />}

        <Flex justify="between" align="center" gap="lg">
          <Text>
            {files.length > 0
              ? `${files.length} file(s) selected`
              : file
                ? `Selected: ${file.name}`
                : selectedFile
                  ? `Selected: ${selectedFile.name}`
                  : "No file selected"}
          </Text>
          <Flex align="center" gap="lg">
            {uploadVideoMutation.isPending && (
              <Button
                type="button"
                variant="outline"
                onClick={() => uploadAbortRef.current?.abort()}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={
                files.length === 0 && !file && !selectedFile && !uploadVideoMutation.isPending
              }
            >
              Upload video
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </form>
  );
}
