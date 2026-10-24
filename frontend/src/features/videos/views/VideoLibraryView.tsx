"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { isAbortError } from "@/features/videos/api/uploadParts";
import { useUploadVideo, useVideos } from "@/features/videos/query/useVideos";
import {
  Container,
  Card,
  Flex,
  Stack,
  Grid,
  Heading,
  Text,
  FormField,
  Input,
  TextArea,
  Button,
  Badge,
  Alert,
  Progress,
  Link,
  EmptyState,
  Form,
} from "@/components/ui";

export default function VideoLibraryView({
  dataHook = "video-library-view",
}: {
  dataHook?: string;
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [recordedAt, setRecordedAt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const { data: videos = [], isLoading, isError, error: listError } = useVideos();
  const uploadVideoMutation = useUploadVideo();

  const stats = useMemo(() => {
    const total = videos?.length;
    const processing = videos?.filter((video) => video.status === "processing").length;
    return { total, processing };
  }, [videos]);

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
    <Container size="lg" dataHook={dataHook}>
      <Card variant="surface" rounded="3xl" padding="xl">
        <Stack gap={8}>
          <Flex justify="between" align="start" gap={4}>
            <Stack gap={1}>
              <Text variant="caption" color="primary" weight="semibold">
                PRIVATE ARCHIVE
              </Text>
              <Heading level={2} size="3xl">
                Your dance videos
              </Heading>
            </Stack>
          </Flex>

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

          <Grid cols={3} colsMobile={1} gap={4}>
            <Card variant="secondary" rounded="2xl" padding="md">
              <Stack gap={2}>
                <Text variant="body-sm" color="muted">
                  Sessions
                </Text>
                <Heading level={3} size="3xl">
                  {stats.total}
                </Heading>
              </Stack>
            </Card>

            <Card variant="secondary" rounded="2xl" padding="md">
              <Stack gap={2}>
                <Text variant="body-sm" color="muted">
                  Processing
                </Text>
                <Heading level={3} size="3xl">
                  {stats.processing}
                </Heading>
              </Stack>
            </Card>

            <Card variant="secondary" rounded="2xl" padding="md">
              <Stack gap={2}>
                <Text variant="body-sm" color="muted">
                  Ready
                </Text>
                <Heading level={3} size="3xl">
                  {videos?.filter((video) => video.status === "ready").length}
                </Heading>
              </Stack>
            </Card>
          </Grid>

          <Card variant="dashed" rounded="2xl" padding="lg">
            {isLoading ? (
              <Text variant="body-sm" color="muted" align="center">
                Loading videos...
              </Text>
            ) : isError ? (
              <Alert variant="error">
                {listError instanceof Error ? listError.message : "Unable to load videos."}
              </Alert>
            ) : videos?.length === 0 ? (
              <EmptyState type="library"></EmptyState>
            ) : (
              <Stack gap={3}>
                {videos?.map((video) => (
                  <Link key={video.id} href={`/videos/${video.id}`} variant="card">
                    <Stack gap={1}>
                      <Text variant="body" weight="medium">
                        {video.title || video.original_name}
                      </Text>
                      <Text variant="caption" color="muted">
                        Status: {video.status}
                      </Text>
                    </Stack>
                    <Badge variant="surface" pill size="sm">
                      {video.size_bytes
                        ? `${(video.size_bytes / (1024 * 1024)).toFixed(1)} MB`
                        : "New"}
                    </Badge>
                  </Link>
                ))}
              </Stack>
            )}
          </Card>
        </Stack>
      </Card>
    </Container>
  );
}
