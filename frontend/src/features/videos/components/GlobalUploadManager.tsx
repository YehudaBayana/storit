"use client";

import React, { useState, useEffect } from "react";
import {
  Paper,
  Stack,
  Group,
  Text,
  Progress,
  ActionIcon,
  Button,
  Collapse,
  Badge,
} from "@mantine/core";
import {
  FiChevronUp,
  FiChevronDown,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiUploadCloud,
} from "react-icons/fi";
import { useUploadStore, UploadTask } from "@/features/videos/store/useUploadStore";
import { useQueryClient } from "@tanstack/react-query";
import { folderKeys } from "@/features/folders/query/useFolders";

export function GlobalUploadManager() {
  const tasks = useUploadStore((state) => state.tasks);
  const cancelUpload = useUploadStore((state) => state.cancelUpload);
  const removeTask = useUploadStore((state) => state.removeTask);
  const clearCompleted = useUploadStore((state) => state.clearCompleted);
  const setOnSuccessCallback = useUploadStore((state) => state.setOnSuccessCallback);

  const [expanded, setExpanded] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    setOnSuccessCallback(() => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    });
  }, [queryClient, setOnSuccessCallback]);

  if (tasks.length === 0) {
    return null;
  }

  const activeUploads = tasks.filter((t) => t.status === "uploading" || t.status === "queued");

  return (
    <Paper
      shadow="md"
      radius="md"
      p="sm"
      withBorder
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 360,
        zIndex: 1000,
        backgroundColor: "var(--mantine-color-body)",
      }}
    >
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <FiUploadCloud size="1.2rem" />
          <Text fw={600} size="sm">
            Uploads ({activeUploads.length} active)
          </Text>
        </Group>
        <Group gap="xs">
          {tasks.length > activeUploads.length && (
            <Button variant="subtle" size="xs" onClick={clearCompleted}>
              Clear
            </Button>
          )}
          <ActionIcon variant="subtle" size="sm" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? <FiChevronDown /> : <FiChevronUp />}
          </ActionIcon>
        </Group>
      </Group>

      <Collapse expanded={expanded}>
        <Stack gap="xs" mt="sm" style={{ maxHeight: 250, overflowY: "auto" }}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onCancel={() => cancelUpload(task.id)}
              onRemove={() => removeTask(task.id)}
            />
          ))}
        </Stack>
      </Collapse>
    </Paper>
  );
}

function TaskItem({
  task,
  onCancel,
  onRemove,
}: {
  task: UploadTask;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const percent = Math.round(task.progress * 100);

  return (
    <Paper p="xs" withBorder radius="sm">
      <Group justify="space-between" align="center" mb={4}>
        <Text size="xs" fw={500} truncate style={{ maxWidth: 220 }}>
          {task.title}
        </Text>
        <Group gap={4}>
          {task.status === "uploading" && (
            <Badge size="xs" color="blue">
              {percent}%
            </Badge>
          )}
          {task.status === "queued" && (
            <Badge size="xs" color="gray">
              Queued
            </Badge>
          )}
          {task.status === "completed" && (
            <Badge size="xs" color="green" leftSection={<FiCheckCircle />}>
              Done
            </Badge>
          )}
          {task.status === "error" && (
            <Badge size="xs" color="red" leftSection={<FiAlertCircle />}>
              Failed
            </Badge>
          )}
          {task.status === "cancelled" && (
            <Badge size="xs" color="orange">
              Cancelled
            </Badge>
          )}

          {task.status === "uploading" || task.status === "queued" ? (
            <ActionIcon size="xs" color="red" variant="subtle" onClick={onCancel}>
              <FiX />
            </ActionIcon>
          ) : (
            <ActionIcon size="xs" color="gray" variant="subtle" onClick={onRemove}>
              <FiX />
            </ActionIcon>
          )}
        </Group>
      </Group>

      {task.status === "uploading" && <Progress value={percent} size="xs" animated />}
      {task.status === "queued" && <Progress value={0} size="xs" color="gray" />}

      {task.error && (
        <Text size="xs" c="red" mt={2} truncate>
          {task.error}
        </Text>
      )}
    </Paper>
  );
}
