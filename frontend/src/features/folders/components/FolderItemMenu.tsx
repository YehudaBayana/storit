"use client";
import React from "react";
import { Menu } from "@mantine/core";
import { FiCornerUpRight, FiEdit2, FiFolderPlus, FiTrash2 } from "react-icons/fi";
import { LibraryItem, Folder } from "../api/folders";

interface FolderItemMenuProps {
  item: LibraryItem;
  viewTrash: boolean;
  folders?: Folder[];
  onRestore: (item: LibraryItem) => void;
  onStartRename: (item: LibraryItem) => void;
  onDeleteFolder: (item: LibraryItem) => void;
  onDeleteVideo?: (videoID: string) => void;
  onMoveTo?: (item: LibraryItem, targetFolderId: string | null) => void;
  onOpenMoveModal?: (item: LibraryItem) => void;
}

export function FolderItemMenu({
  item,
  viewTrash,
  onRestore,
  onStartRename,
  onDeleteFolder,
  onDeleteVideo,
  onMoveTo,
  onOpenMoveModal,
}: FolderItemMenuProps) {
  if (viewTrash) {
    return (
      <Menu.Item leftSection={<FiCornerUpRight size={14} />} onClick={() => onRestore(item)}>
        Restore
      </Menu.Item>
    );
  }

  const handleDelete = () => {
    if (item.type === "folder") {
      onDeleteFolder(item);
    } else if (onDeleteVideo) {
      const videoId = item.video?.id ?? item.id;
      onDeleteVideo(videoId);
    }
  };

  return (
    <>
      {item.type === "folder" && (
        <Menu.Item leftSection={<FiEdit2 size={14} />} onClick={() => onStartRename(item)}>
          Rename
        </Menu.Item>
      )}

      {onMoveTo && onOpenMoveModal && (
        <Menu.Item
          leftSection={<FiFolderPlus size={14} />}
          onClick={() => {
            onOpenMoveModal(item);
          }}
        >
          Move to
        </Menu.Item>
      )}

      <Menu.Item leftSection={<FiTrash2 size={14} />} color="red" onClick={handleDelete}>
        {item.type === "video" ? "Delete" : "Move to Trash"}
      </Menu.Item>
    </>
  );
}
