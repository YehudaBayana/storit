"use client";

import { useState, useRef, useEffect } from "react";
import { ActionIcon, Group, Text, Box, Portal } from "@mantine/core";
import { MdClose, MdMinimize, MdOpenInFull } from "react-icons/md";
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";
import { useVideoPlaybackRecovery } from "../hooks/useVideoPlaybackRecovery";

export function FloatingVideoPlayer() {
  const { activeVideo, isMinimized, closeVideo, minimizeVideo, maximizeVideo } =
    useVideoPlayerStore();
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const mousedownTargetRef = useRef<EventTarget | null>(null);

  const videoId = activeVideo?.id;
  const {
    aspectRatio,
    videoElementRef,
    playback,
    handlePlaybackError,
    handleTimeUpdate,
    handleLoadedMetadata,
  } = useVideoPlaybackRecovery(videoId, Boolean(videoId && activeVideo));

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  useEffect(() => {
    if (videoElementRef.current && videoElementRef.current.currentTime > 0) {
      // no-op or sync if needed
    }
  }, [isMinimized, videoElementRef]);

  if (!activeVideo) {
    return null;
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: pos.x,
      initialY: pos.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      x: Math.max(0, dragRef.current.initialX - dx),
      y: Math.max(0, dragRef.current.initialY - dy),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture already lost
    }
  };

  const isPortrait = aspectRatio < 1;

  const floatingMaxWidth = isPortrait ? "180px" : "320px";
  const floatingMaxHeight = isPortrait ? "420px" : "270px";

  const modalMaxWidth = isPortrait ? "360px" : "640px";
  const modalMaxHeight = isPortrait ? "840px" : "540px";

  if (isMinimized) {
    return (
      <Portal>
        <div
          style={{
            position: "fixed",
            bottom: `${pos.y}px`,
            right: `${pos.x}px`,
            zIndex: 1000,
            boxShadow: "var(--mantine-shadow-xl)",
            maxWidth: floatingMaxWidth,
            maxHeight: floatingMaxHeight,
          }}
          className="bg-dark-9 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-dark-4"
        >
          <Group
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="bg-dark-8 px-3 py-2 cursor-grab active:cursor-grabbing select-none border-b border-dark-4 flex justify-between items-center touch-none"
            justify="space-between"
            gap="xs"
          >
            <Group gap="xs" style={{ overflow: "hidden", flex: 1 }}>
              <Text size="sm" fw={500} truncate className="text-gray-200">
                {activeVideo.title}
              </Text>
            </Group>

            <Group gap={4} className="shrink-0" onPointerDown={(e) => e.stopPropagation()}>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  maximizeVideo();
                }}
                title="Expand"
              >
                <MdOpenInFull size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  closeVideo();
                }}
                title="Close"
              >
                <MdClose size={16} />
              </ActionIcon>
            </Group>
          </Group>

          <Box
            className="relative flex items-center justify-center bg-black overflow-hidden w-full h-full object-fit"
            style={{ aspectRatio: `${aspectRatio}` }}
          >
            <video
              ref={videoElementRef}
              src={playback?.url}
              controls
              autoPlay
              onError={handlePlaybackError}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="bg-black block w-full h-full object-fit pointer-events-auto"
            >
              <track kind="captions" />
            </video>
          </Box>
        </div>
      </Portal>
    );
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 z-1000 flex items-center justify-center bg-black/60"
        onMouseDown={(e) => {
          mousedownTargetRef.current = e.target;
        }}
        onMouseUp={(e) => {
          if (mousedownTargetRef.current === e.currentTarget && e.target === e.currentTarget) {
            minimizeVideo();
          }
          mousedownTargetRef.current = null;
        }}
      >
        <div
          className="bg-dark-9 flex flex-col overflow-hidden rounded-lg shadow-2xl border border-dark-4 bg-black"
          style={{
            aspectRatio: `${aspectRatio}`,
            maxWidth: modalMaxWidth,
            maxHeight: modalMaxHeight,
            width: "100%",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Group
            className="bg-dark-8 px-4 py-3 select-none border-b border-dark-4 flex justify-between items-center"
            justify="space-between"
            gap="xs"
          >
            <Group gap="xs" className="flex-1 overflow-hidden">
              <Text size="md" fw={500} truncate className="text-gray-200">
                {activeVideo.title}
              </Text>
            </Group>

            <Group gap={8} className="shrink-0">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeVideo();
                }}
                title="Minimize"
              >
                <MdMinimize size={20} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  closeVideo();
                }}
                title="Close"
              >
                <MdClose size={20} />
              </ActionIcon>
            </Group>
          </Group>

          <Box
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              aspectRatio: `${aspectRatio}`,
            }}
          >
            <video
              ref={videoElementRef}
              src={playback?.url}
              controls
              autoPlay
              onError={handlePlaybackError}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="bg-black block max-w-full max-h-full object-fit m-auto"
            >
              <track kind="captions" />
            </video>
          </Box>
        </div>
      </div>
    </Portal>
  );
}
