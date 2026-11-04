"use client";
import React from "react";
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
}: LibraryItemTileProps) {
  const [menuOpened, setMenuOpened] = React.useState(false);

  return (
    <Menu opened={menuOpened} onChange={setMenuOpened} position="bottom-start" shadow="sm">
      <Menu.Target>
        <Box
          w={112}
          p="xs"
          onClick={onSelect}
          onDoubleClick={onOpen}
          onContextMenu={(event: React.MouseEvent) => {
            event.preventDefault();
            onSelect(event);
            setMenuOpened(true);
          }}
          style={{
            cursor: "default",
            opacity: isCut ? 0.5 : 1,
            borderRadius: 6,
            backgroundColor: isSelected ? "var(--mantine-color-blue-light)" : undefined,
            userSelect: "none",
          }}
        >
          <Stack gap={6} align="center">
            <Box h={ICON_SIZE} style={{ display: "flex", alignItems: "center" }}>
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
              <Text size="xs" ta="center" lineClamp={2} style={{ wordBreak: "break-word" }}>
                {item.name}
              </Text>
            )}
          </Stack>
        </Box>
      </Menu.Target>
      <Menu.Dropdown>{menuContent}</Menu.Dropdown>
    </Menu>
  );
}
