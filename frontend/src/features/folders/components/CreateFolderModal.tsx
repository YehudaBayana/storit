import React from "react";
import { Modal, Stack, TextInput, Group, Button } from "@mantine/core";

interface CreateFolderModalProps {
  opened: boolean;
  onClose: () => void;
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateFolderModal({
  opened,
  onClose,
  folderName,
  onFolderNameChange,
  onSubmit,
}: CreateFolderModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Create New Folder">
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <TextInput
            label="Folder Name"
            placeholder="My Folder"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            data-autofocus
            required
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
