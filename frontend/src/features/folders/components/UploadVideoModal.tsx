import React from "react";
import { Modal, Stack, TextInput, Text, Alert, Progress, Group, Button } from "@mantine/core";

interface UploadVideoModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  onTitleChange: (val: string) => void;
  notes: string;
  onNotesChange: (val: string) => void;
  targetFolderID?: string | null;
  onTargetFolderIDChange?: (val: string | null) => void;
  folderOptions?: { value: string; label: string }[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  isUploading: boolean;
  progress: number;
  onCancelUpload: () => void;
  onSubmit: (e: React.FormEvent) => void;
  fileSelected: boolean;
}

export function UploadVideoModal({
  opened,
  onClose,
  title,
  onTitleChange,
  notes,
  onNotesChange,
  onFileChange,
  error,
  isUploading,
  progress,
  onCancelUpload,
  onSubmit,
  fileSelected,
}: UploadVideoModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Upload Video to Folder">
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <TextInput
            label="Video Title"
            placeholder="My Video"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <TextInput
            label="Notes"
            placeholder="Optional notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
          />
          <div>
            <Text size="sm" fw={500} mb={4}>
              Video File
            </Text>
            <input
              type="file"
              accept="video/*,.mp4,.mov,.avi,.webm,.mkv,.m4v"
              onChange={onFileChange}
              required
            />
          </div>

          {error && <Alert color="red" title={error} />}

          {isUploading && (
            <Stack gap="sm">
              <Progress value={Math.round(progress * 100)} />
              <Text size="sm">Uploading {Math.round(progress * 100)}%. Keep this tab open.</Text>
            </Stack>
          )}

          <Group justify="flex-end">
            {isUploading ? (
              <Button type="button" variant="outline" onClick={onCancelUpload}>
                Cancel Upload
              </Button>
            ) : (
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!fileSelected || isUploading}>
              Upload
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
