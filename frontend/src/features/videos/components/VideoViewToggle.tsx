"use client";

import { Group, ActionIcon, Tooltip } from "@mantine/core";
import { IconLayoutGrid, IconList } from "@tabler/icons-react";

interface Props {
  viewMode: "icons" | "list";
  onViewModeChange: (mode: "icons" | "list") => void;
}

export function VideoViewToggle({ viewMode, onViewModeChange }: Props) {
  return (
    <Group gap="xs">
      <Tooltip label="Icons View">
        <ActionIcon
          variant={viewMode === "icons" ? "filled" : "light"}
          color="blue"
          onClick={() => onViewModeChange("icons")}
          aria-label="Icons View"
        >
          <IconLayoutGrid size={18} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="List View">
        <ActionIcon
          variant={viewMode === "list" ? "filled" : "light"}
          color="blue"
          onClick={() => onViewModeChange("list")}
          aria-label="List View"
        >
          <IconList size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
