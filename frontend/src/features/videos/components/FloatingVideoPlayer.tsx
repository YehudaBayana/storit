"use client";

import { useState, useRef } from "react";
import { ActionIcon, Group, Text, Box, AspectRatio, Portal, Overlay } from "@mantine/core";
import { MdClose, MdMinimize, MdOpenInFull, MdDragIndicator } from "react-icons/md";
import { usePlaybackUrl } from "../query/useVideos";
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";

export function FloatingVideoPlayer() {
  const { activeVideo, isMinimized, closeVideo, minimizeVideo, maximizeVideo } =
    useVideoPlayerStore();
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const videoId = activeVideo?.id;
  const { data: playback } = usePlaybackUrl(
    videoId ?? "",
    Boolean(videoId) && activeVideo?.status === "ready",
  );

  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(
    null,
  );

  if (!activeVideo) {
    return null;
  }

  const handlePointerDown = (e: React.PointerEvent) => {
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
    if (!dragRef.current) {
      return;
    }
    const dx = dragRef.current.startX - e.clientX;
    const dy = dragRef.current.startY - e.clientY;

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

  return (
    <Portal>
      {/* Backdrop for maximized state */}
      {!isMinimized && (
        <Overlay
          color="#000"
          backgroundOpacity={0.85}
          zIndex={9998}
          fixed
          onClick={minimizeVideo}
        />
      )}

      {/* Single shared container to preserve <video> tree structure and playback state */}
      <Box
        style={{
          position: "fixed",
          zIndex: 9999,
          ...(isMinimized
            ? {
                bottom: `${pos.y}px`,
                right: `${pos.x}px`,
                width: "320px",
              }
            : {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                maxWidth: "1000px",
              }),
        }}
        className={
          isMinimized
            ? "bg-black rounded-lg shadow-xl border border-gray-700 flex flex-col overflow-hidden"
            : "bg-black rounded-lg shadow-2xl flex flex-col overflow-hidden"
        }
      >
        {isMinimized ? (
          <Group
            justify="space-between"
            className="bg-gray-900 p-2 cursor-move touch-none"
            onPointerDown={handlePointerDown}
          >
            <Group gap="xs">
              <MdDragIndicator className="text-gray-400" />
              <Text size="xs" className="text-white truncate max-w-[150px]">
                {activeVideo.title}
              </Text>
            </Group>
            <Group gap="xs">
              <ActionIcon variant="subtle" color="gray" onClick={maximizeVideo} size="sm">
                <MdOpenInFull />
              </ActionIcon>
              <ActionIcon variant="subtle" color="red" onClick={closeVideo} size="sm">
                <MdClose />
              </ActionIcon>
            </Group>
          </Group>
        ) : (
          <Box className="absolute top-4 right-4 z-10">
            <Group gap="sm">
              <ActionIcon
                variant="filled"
                color="dark"
                onClick={minimizeVideo}
                className="opacity-70 hover:opacity-100 transition-opacity shadow-sm"
                size="lg"
                title="Minimize to corner"
              >
                <MdMinimize />
              </ActionIcon>
              <ActionIcon
                variant="filled"
                color="dark"
                onClick={closeVideo}
                className="opacity-70 hover:opacity-100 transition-opacity shadow-sm"
                size="lg"
                title="Close video"
              >
                <MdClose />
              </ActionIcon>
            </Group>
          </Box>
        )}

        {/* The video element itself - remains intact avoiding remounts */}
        <Box
          className={`relative w-full flex justify-center bg-black overflow-hidden flex-1 ${isMinimized ? "" : "rounded-b-md"}`}
        >
          <AspectRatio mx="auto" h="85%" w="85%">
            <video
              src={playback?.url}
              controls
              autoPlay
              // style={isMinimized ? undefined : { maxHeight: "calc(100vh - 120px)" }}
              className={`w-full block bg-black aspect-video ${isMinimized ? "h-full" : "h-full"}`}
            >
              <track kind="captions" />
            </video>
          </AspectRatio>
        </Box>
      </Box>
    </Portal>
  );
}
