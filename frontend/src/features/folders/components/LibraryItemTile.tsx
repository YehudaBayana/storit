"use client";
import React, { useState } from "react";
import { Box, Image, Menu, Stack, Text, TextInput } from "@mantine/core";
import { FiFolder, FiVideo } from "react-icons/fi";
import { LibraryItem } from "../api/folders";
import { getVideoThumbnailUrl } from "@/features/videos/api/videos";

interface LibraryItemTileProps {
  item: LibraryItem;
  isSelected: boolean;
  isCut: boolean;
  isRenaming: boolean;
  renameValue: string;
  menuContent: React.ReactNode;
  onRenameValueChange: (value: string) => void;
  onRenameSubmit: () => void;
  onRenameCancel: () => void;
  onSelect: (event: React.MouseEvent) => void;
  onOpen: () => void;
  onDropItem?: (draggedItem: LibraryItem, targetFolder: LibraryItem) => void;
}

const ICON_SIZE = 64;

function ItemPreview({ item }: { item: LibraryItem }) {
  if (item.type === "folder") {
    return <FiFolder size={ICON_SIZE} color="var(--mantine-color-blue-5)" strokeWidth={1.2} />;
  }
  return (
    <Image
      src={getVideoThumbnailUrl(item.video?.id ?? item.id)}
      w={ICON_SIZE * 1.5}
      h={ICON_SIZE}
      radius="xs"
      fit="cover"
      alt={item.name}
      fallbackSrc="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
      style={{ backgroundColor: "var(--mantine-color-default-border)" }}
    />
  );
}

export function LibraryItemTile({
  item,
  isSelected,
  isCut,
  isRenaming,
  renameValue,
  menuContent,
  onRenameValueChange,
  onRenameSubmit,
  onRenameCancel,
  onSelect,
  onOpen,
  onDropItem,
}: LibraryItemTileProps) {
  const [menuOpened, setMenuOpened] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (item.type === "folder") {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (!isDragOver) setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (item.type === "folder") {
      e.preventDefault();
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (item.type === "folder") {
      e.preventDefault();
      setIsDragOver(false);
      const data = e.dataTransfer.getData("application/json");
      if (data) {
        try {
          const draggedItem: LibraryItem = JSON.parse(data);
          if (draggedItem.id !== item.id) {
            onDropItem?.(draggedItem, item);
          }
        } catch {
          // ignore invalid json
        }
      }
    }
  };

  return (
    <Menu opened={menuOpened} onChange={setMenuOpened} position="bottom-start" shadow="sm">
      <Menu.ContextMenu>
        <Box
          w={112}
          p="xs"
          draggable={!isRenaming}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={onSelect}
          onDoubleClick={onOpen}
          onContextMenu={(event: React.MouseEvent) => {
            onSelect(event);
          }}
          style={{
            cursor: "grab",
            opacity: isCut ? 0.5 : 1,
            borderRadius: 6,
            backgroundColor: isDragOver
              ? "var(--mantine-color-blue-2)"
              : isSelected
                ? "var(--mantine-color-blue-light)"
                : undefined,
            outline: isDragOver ? "2px dashed var(--mantine-color-blue-6)" : undefined,
            userSelect: "none",
          }}
        >
          <Stack gap={6} align="center">
            <Box
              h={ICON_SIZE}
              style={{ display: "flex", alignItems: "center", pointerEvents: "none" }}
            >
              {item.type === "video" && !item.video ? (
                <FiVideo size={ICON_SIZE} />
              ) : (
                <ItemPreview item={item} />
              )}
            </Box>
            {isRenaming ? (
              <TextInput
                size="xs"
                value={renameValue}
                autoFocus
                onChange={(event) => onRenameValueChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onRenameSubmit();
                  if (event.key === "Escape") onRenameCancel();
                }}
                onClick={(event) => event.stopPropagation()}
                onDoubleClick={(event) => event.stopPropagation()}
              />
            ) : (
              <Text
                size="xs"
                ta="center"
                lineClamp={2}
                style={{ wordBreak: "break-word", pointerEvents: "none" }}
              >
                {item.name}
              </Text>
            )}
          </Stack>
        </Box>
      </Menu.ContextMenu>
      <Menu.Dropdown>{menuContent}</Menu.Dropdown>
    </Menu>
  );
}
