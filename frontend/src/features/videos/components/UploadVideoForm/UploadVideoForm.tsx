"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { isAbortError } from "@/features/videos/api/uploadParts";
import { useUploadVideo } from "@/features/videos/query/useVideos";
import {
  Alert,
  Button,
  Flex,
  Form,
  FormField,
  Grid,
  Input,
  Progress,
  Stack,
  Text,
  TextArea,
} from "@/components/ui";

export function UploadVideoForm() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [recordedAt, setRecordedAt] = useState("");
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
        recordedAt,
        signal: uploadAbort.signal,
        onProgress: setProgress,
      });
      setTitle("");
      setNotes("");
      setRecordedAt("");
      setFile(null);
      const fileInput = document.getElementById("video-upload-input") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
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
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Grid cols={2} colsMobile={1} gap={4}>
          <Grid.Item colSpan={2} colSpanTablet={2}>
            <FormField label="Video file" htmlFor="video-upload-input">
              <Input
                id="video-upload-input"
                type="file"
                accept="video/*,.mp4,.mov,.avi,.webm,.mkv,.m4v"
                onChange={handleFileChange}
              />
            </FormField>
          </Grid.Item>

          <FormField label="Title">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Sunrise drill"
            />
          </FormField>

          <FormField label="Recorded date">
            <Input
              type="date"
              value={recordedAt}
              onChange={(event) => setRecordedAt(event.target.value)}
            />
          </FormField>

          <Grid.Item colSpan={2} colSpanTablet={2}>
            <FormField label="Notes">
              <TextArea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="What improved today?"
              />
            </FormField>
          </Grid.Item>
        </Grid>

        {error && <Alert variant="error">{error}</Alert>}

        {uploadVideoMutation.isPending && (
          <Stack gap={2}>
            <Progress value={Math.round(progress * 100)} variant="default" />
            <Text variant="caption" color="muted">
              Uploading {Math.round(progress * 100)}%. Keep this tab open until it finishes.
            </Text>
          </Stack>
        )}

        <Flex justify="between" align="center" gap={3}>
          <Text variant="caption" color="muted">
            {file ? `Selected: ${file.name}` : "No file selected"}
          </Text>
          <Flex align="center" gap={3}>
            {uploadVideoMutation.isPending && (
              <Button
                type="button"
                variant="outline"
                pill
                onClick={() => uploadAbortRef.current?.abort()}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              pill
              disabled={!file || uploadVideoMutation.isPending}
              loading={uploadVideoMutation.isPending}
              loadingText="Uploading..."
            >
              Upload video
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </Form>
  );
}
