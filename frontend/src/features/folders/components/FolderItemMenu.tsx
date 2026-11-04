import React from "react";
import { Menu } from "@mantine/core";
import { FiCornerUpRight, FiEdit2, FiTrash2 } from "react-icons/fi";
import { LibraryItem } from "../api/folders";

interface FolderItemMenuProps {
  item: LibraryItem;
  viewTrash: boolean;
  onRestore: (item: LibraryItem) => void;
  onStartRename: (item: LibraryItem) => void;
  onDeleteFolder: (item: LibraryItem) => void;
}

export function FolderItemMenu({
  item,
  viewTrash,
  onRestore,
  onStartRename,
  onDeleteFolder,
}: FolderItemMenuProps) {
  if (viewTrash) {
    return (
      <Menu.Item
        leftSection={<FiCornerUpRight size={14} />}
        onClick={() => onRestore(item)}
      >
        Restore
      </Menu.Item>
    );
  }

  return (
    <>
      {item.type === "folder" && (
        <Menu.Item
          leftSection={<FiEdit2 size={14} />}
          onClick={() => onStartRename(item)}
        >
          Rename
        </Menu.Item>
      )}
      <Menu.Item
        leftSection={<FiTrash2 size={14} />}
        color="red"
        onClick={() => onDeleteFolder(item)}
      >
        Move to Trash
      </Menu.Item>
    </>
  );
}
