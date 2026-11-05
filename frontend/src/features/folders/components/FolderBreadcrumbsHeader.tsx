import React, { useState } from "react";
import { Group, Button, Divider } from "@mantine/core";
import { FiChevronRight } from "react-icons/fi";
import { LibraryItem } from "../api/folders";

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface FolderBreadcrumbsHeaderProps {
  pathSegments: BreadcrumbItem[];
  viewTrash: boolean;
  hasTrashItems: boolean;
  onNavigate: (folderId: string | null, folderName: string) => void;
  onOpenUpload: () => void;
  onOpenCreateFolder: () => void;
  onEmptyTrash: () => void;
  onDropItem?: (draggedItem: LibraryItem, targetFolderId: string | null) => void;
}

function BreadcrumbButton({
  segment,
  index,
  total,
  viewTrash,
  onNavigate,
  onDropItem,
}: {
  segment: BreadcrumbItem;
  index: number;
  total: number;
  viewTrash: boolean;
  onNavigate: (folderId: string | null, folderName: string) => void;
  onDropItem?: (draggedItem: LibraryItem, targetFolderId: string | null) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (!viewTrash) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (!isDragOver) setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!viewTrash) {
      e.preventDefault();
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!viewTrash) {
      e.preventDefault();
      setIsDragOver(false);
      const data = e.dataTransfer.getData("application/json");
      if (data) {
        try {
          const draggedItem: LibraryItem = JSON.parse(data);
          onDropItem?.(draggedItem, segment.id);
        } catch {
          // ignore invalid json
        }
      }
    }
  };

  return (
    <Button
      variant={isDragOver ? "light" : "subtle"}
      color={isDragOver ? "blue" : "gray"}
      size="compact-sm"
      fw={index === total - 1 ? 600 : 400}
      disabled={viewTrash}
      onClick={() => onNavigate(segment.id, segment.name)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        outline: isDragOver ? "2px dashed var(--mantine-color-blue-6)" : undefined,
      }}
    >
      {segment.name}
    </Button>
  );
}

export function FolderBreadcrumbsHeader({
  pathSegments,
  viewTrash,
  hasTrashItems,
  onNavigate,
  onOpenUpload,
  onOpenCreateFolder,
  onEmptyTrash,
  onDropItem,
}: FolderBreadcrumbsHeaderProps) {
  return (
    <>
      <Group justify="space-between" px="md" py="xs" onClick={(e) => e.stopPropagation()}>
        <Group gap={2}>
          {pathSegments.map((segment, index) => (
            <Group key={segment.id ?? "root"} gap={2}>
              {index > 0 && <FiChevronRight size={12} />}
              <BreadcrumbButton
                segment={segment}
                index={index}
                total={pathSegments.length}
                viewTrash={viewTrash}
                onNavigate={onNavigate}
                onDropItem={onDropItem}
              />
            </Group>
          ))}
        </Group>
        {!viewTrash && (
          <Group gap="xs">
            <Button variant="subtle" color="gray" size="compact-sm" onClick={onOpenUpload}>
              Upload
            </Button>
            <Button variant="subtle" color="gray" size="compact-sm" onClick={onOpenCreateFolder}>
              New Folder
            </Button>
          </Group>
        )}
        {viewTrash && hasTrashItems && (
          <Button color="red" variant="subtle" size="compact-sm" onClick={onEmptyTrash}>
            Empty Trash
          </Button>
        )}
      </Group>
      <Divider />
    </>
  );
}
