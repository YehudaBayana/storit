"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Grid, Stack, Alert, Button, Flex, Input, Progress, Text, Textarea } from "@mantine/core";
import { isAbortError } from "@/features/videos/api/uploadParts";
import { useUploadVideo } from "@/features/videos/query/useVideos";

export function UploadVideoForm() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const uploadVideoMutation = useUploadVideo();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    if (selectedFile) {
      setTitle((current) => current || selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Select a video file to upload.");
      return;
    }

    setError(null);
    setProgress(0);
    const uploadAbort = new AbortController();
    uploadAbortRef.current = uploadAbort;
    try {
      await uploadVideoMutation.mutateAsync({
        file,
        title,
        notes,
        signal: uploadAbort.signal,
        onProgress: setProgress,
      });
      setTitle("");
      setNotes("");
      setFile(null);
      const fileInput = document.getElementById("video-upload-input") as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (submitError) {
      if (isAbortError(submitError)) {
        setError("Upload cancelled.");
      } else {
        setError(submitError instanceof Error ? submitError.message : "Upload failed.");
      }
    } finally {
      uploadAbortRef.current = null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Grid columns={2} gap="lg">
          <Grid.Col span={2}>
            <Input.Wrapper label="Video file">
              <Input
                id="video-upload-input"
                type="file"
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

        {uploadVideoMutation.isPending && (
          <Stack gap="sm">
            <Progress value={Math.round(progress * 100)} />
            <Text>
              Uploading {Math.round(progress * 100)}%. Keep this tab open until it finishes.
            </Text>
          </Stack>
        )}

        <Flex justify="between" align="center" gap="lg">
          <Text>{file ? `Selected: ${file.name}` : "No file selected"}</Text>
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
              disabled={!file || uploadVideoMutation.isPending}
            >
              Upload video
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </form>
  );
}
