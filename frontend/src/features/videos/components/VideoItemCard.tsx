"use client";

import React, { useState } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  AspectRatio,
  Menu,
  ActionIcon,
  Modal,
  Button,
} from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { getVideoThumbnailUrl, Video, deleteVideo } from "../api/videos";
import { formatDuration, formatFileSize, formatDate } from "../utils/formatters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/store/useToastStore";

interface Props {
  video: Video;
  viewMode: "icons" | "list";
  onClick: (video: Video) => void;
  onDoubleClick?: (video: Video) => void;
  isSelected?: boolean;
}

export function VideoItemCard({
  video,
  viewMode,
  onClick,
  onDoubleClick,
  isSelected = false,
}: Props) {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.success);
  const showErrorToast = useToastStore((state) => state.error);

  const deleteMutation = useMutation({
    mutationFn: () => deleteVideo(video.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      showToast("Video deleted successfully");
      setDeleteModalOpened(false);
    },
    onError: (err) => {
      showErrorToast(err?.message || "Failed to delete video");
    },
  });

  const thumbnailUrl = getVideoThumbnailUrl(video.id);
  const durationFormatted = formatDuration(video.duration_ms);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModalOpened(true);
  };

  if (viewMode === "list") {
    return (
      <>
        <Card
          shadow="xs"
          padding="sm"
          radius="md"
          withBorder
          onClick={() => onClick(video)}
          onDoubleClick={() => onDoubleClick?.(video)}
          aria-selected={isSelected}
          style={
            isSelected ? { outline: "2px solid var(--mantine-primary-color-filled)" } : undefined
          }
          className="cursor-pointer hover:shadow-sm transition-shadow flex flex-row items-center gap-4 relative"
        >
          <div className="relative w-28 h-16 shrink-0">
            <Image
              src={thumbnailUrl}
              height={64}
              alt={video.title}
              className="object-cover rounded"
              fallbackSrc="https://placehold.co/600x400?text=No+Thumbnail"
            />
            <Badge
              className="absolute bottom-1 right-1 text-[10px] px-1 py-0 opacity-90"
              color="dark"
              radius="sm"
            >
              {durationFormatted}
            </Badge>
          </div>
          <div className="grow min-w-0 grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2 truncate">
              <Text fw={500} size="sm" lineClamp={1}>
                {video.title}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                {formatDate(video.created_at)}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                {formatFileSize(video.size_bytes)}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="xs" c="dimmed" truncate>
                {video.mime_type || "video/mp4"}
              </Text>
              <div onClick={handleMenuClick}>
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" size="sm">
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={handleDeleteClick}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </div>
          </div>
        </Card>

        <Modal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          title="Delete Video"
          centered
          onClick={(e) => e.stopPropagation()}
        >
          <Text size="sm" mb="lg">
            Are you sure you want to delete &quot;{video.title}&quot;? This will remove the video
            from your database and permanently delete its media files from storage.
          </Text>
          <Group justify="end">
            <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
              Cancel
            </Button>
            <Button color="red" loading={deleteMutation.isPending} onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </Group>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Card
        shadow="sm"
        padding="sm"
        radius="md"
        withBorder
        onClick={() => onClick(video)}
        onDoubleClick={() => onDoubleClick?.(video)}
        aria-selected={isSelected}
        style={
          isSelected ? { outline: "2px solid var(--mantine-primary-color-filled)" } : undefined
        }
        className="cursor-pointer hover:shadow-md transition-shadow relative group"
      >
        <Card.Section className="relative">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fallbackSrc="https://placehold.co/600x400?text=No+Thumbnail"
            />
          </AspectRatio>
          <Badge
            className="absolute bottom-2 right-2 opacity-90 text-xs px-1.5"
            color="dark"
            radius="sm"
          >
            {durationFormatted}
          </Badge>
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleMenuClick}
          >
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon
                  variant="filled"
                  color="dark"
                  radius="xl"
                  size="sm"
                  className="opacity-80 hover:opacity-100"
                >
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={handleDeleteClick}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Card.Section>
        <Group mt="xs" mb="xs" justify="space-between">
          <Text fw={500} size="sm" lineClamp={1} style={{ flex: 1 }}>
            {video.title}
          </Text>
        </Group>
      </Card>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Video"
        centered
        onClick={(e) => e.stopPropagation()}
      >
        <Text size="sm" mb="lg">
          Are you sure you want to delete &quot;{video.title}&quot;? This will remove the video from
          your database and permanently delete its media files from storage.
        </Text>
        <Group justify="end">
          <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
            Cancel
          </Button>
          <Button color="red" loading={deleteMutation.isPending} onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
