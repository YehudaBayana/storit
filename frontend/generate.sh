#!/bin/bash
cat << 'EOF' > src/features/videos/components/FloatingVideoPlayer.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Modal, ActionIcon, Group, Text, Box } from "@mantine/core";
import { MdClose, MdMinimize, MdOpenInFull, MdDragIndicator } from "react-icons/md";
import { Video } from "../api/videos";
import { usePlaybackUrl } from "../query/useVideos";

interface Props {
  video: Video | null;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export function FloatingVideoPlayer({
  video,
  isMinimized,
  onClose,
  onMinimize,
  onMaximize,
}: Props) {
  // Store the coordinates from the bottom-right corner
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const videoId = video?.id;
  const { data: playback, refetch: refetchPlayback } = usePlaybackUrl(
    videoId ?? "",
    Boolean(videoId) && video?.status === "ready",
  );

  // Keep track of where the user clicked to start dragging without causing re-renders
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(
    null,
  );

  if (!video) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    // Capture the initial click position and the current element coordinates
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: pos.x,
      initY: pos.y,
    };
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragRef.current) return;
    // Calculate how far the mouse has moved
    const dx = dragRef.current.startX - e.clientX;
    const dy = dragRef.current.startY - e.clientY;

    // Apply that distance to our coordinates (clamping values could be added here if needed)
    setPos({
      x: dragRef.current.initX + dx,
      y: dragRef.current.initY + dy,
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  if (isMinimized) {
    return (
      <Box
        style={{
          position: "fixed",
          bottom: `${pos.y}px`,
          right: `${pos.x}px`,
          width: "320px",
          zIndex: 1000,
        }}
        className="bg-black rounded-lg shadow-xl overflow-hidden border border-gray-700"
      >
        {/* Drag Handle Area */}
        <Group
          justify="space-between"
          className="bg-gray-900 p-2 cursor-move touch-none"
          onPointerDown={handlePointerDown}
        >
          <Group gap="xs">
            <MdDragIndicator className="text-gray-400" />
            <Text size="xs" className="text-white truncate max-w-[150px]">
              {video.title}
            </Text>
          </Group>
          <Group gap="xs">
            <ActionIcon variant="subtle" color="gray" onClick={onMaximize} size="sm">
              <MdOpenInFull />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red" onClick={onClose} size="sm">
              <MdClose />
            </ActionIcon>
          </Group>
        </Group>

        <video src={playback?.url} controls autoPlay className="w-full aspect-video object-contain bg-black block" />
      </Box>
    );
  }

  return (
    <Modal
      opened={true}
      onClose={onClose}
      size="xl"
      title={video.title}
      centered
      // The below styles prevent the modal body from scrolling by strictly matching the internal padding 
      // and letting the aspect ratio/height constraints take over perfectly
      styles={{ 
        body: { padding: 0 }, 
        header: { paddingBottom: 16 } 
      }}
    >
      <Box className="relative w-full flex justify-center bg-black overflow-hidden rounded-b-md">
        <ActionIcon
          variant="filled"
          color="dark"
          onClick={onMinimize}
          className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100 transition-opacity shadow-sm"
          size="lg"
          title="Minimize to corner"
        >
          <MdMinimize />
        </ActionIcon>
        
        {/* display: block removes the inline baseline gap, max-height ensures no vertical overflow beyond the viewport bounds */}
        <video
          src={playback?.url}
          controls
          autoPlay
          style={{ maxHeight: 'calc(100vh - 120px)' }}
          className="w-full object-contain block bg-black aspect-video"
        />
      </Box>
    </Modal>
  );
}
EOF