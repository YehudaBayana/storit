import React from "react";
import { Group, Button, Divider } from "@mantine/core";
import { FiChevronRight } from "react-icons/fi";

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
}

export function FolderBreadcrumbsHeader({
  pathSegments,
  viewTrash,
  hasTrashItems,
  onNavigate,
  onOpenUpload,
  onOpenCreateFolder,
  onEmptyTrash,
}: FolderBreadcrumbsHeaderProps) {
  return (
    <>
      <Group justify="space-between" px="md" py="xs" onClick={(e) => e.stopPropagation()}>
        <Group gap={2}>
          {pathSegments.map((segment, index) => (
            <Group key={segment.id ?? "root"} gap={2}>
              {index > 0 && <FiChevronRight size={12} />}
              <Button
                variant="subtle"
                color="gray"
                size="compact-sm"
                fw={index === pathSegments.length - 1 ? 600 : 400}
                disabled={viewTrash}
                onClick={() => onNavigate(segment.id, segment.name)}
              >
                {segment.name}
              </Button>
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
