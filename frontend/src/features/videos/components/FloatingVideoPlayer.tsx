"use client";

import { useState, useRef, SyntheticEvent, useEffect } from "react";
import { ActionIcon, Group, Text, Box, Modal, FloatingWindow } from "@mantine/core";
import { MdClose, MdMinimize, MdOpenInFull, MdDragIndicator } from "react-icons/md";
import { usePlaybackUrl } from "../query/useVideos";
import { useVideoPlayerStore } from "@/store/useVideoPlayerStore";

export function FloatingVideoPlayer() {
  const { activeVideo, isMinimized, closeVideo, minimizeVideo, maximizeVideo } =
    useVideoPlayerStore();
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentTimeRef = useRef<number>(0);

  const videoId = activeVideo?.id;
  const { data: playback } = usePlaybackUrl(videoId ?? "", Boolean(videoId && activeVideo));

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  // Keep track of current playback time before unmounting/switching state
  const handleTimeUpdate = (e: SyntheticEvent<HTMLVideoElement>) => {
    currentTimeRef.current = e.currentTarget.currentTime;
  };

  // Restore playback time once the video ref is loaded/mounted
  const handleLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.videoWidth && video.videoHeight) {
      setAspectRatio(video.videoWidth / video.videoHeight);
    }
    if (currentTimeRef.current > 0) {
      video.currentTime = currentTimeRef.current;
    }
  };

  useEffect(() => {
    if (videoRef.current && currentTimeRef.current > 0) {
      videoRef.current.currentTime = currentTimeRef.current;
    }
  }, [isMinimized]);

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
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
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
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture already lost
    }
  };

  if (isMinimized) {
    return (
      <FloatingWindow
        style={{
          position: "fixed",
          bottom: `${pos.y}px`,
          right: `${pos.x}px`,
          zIndex: 1000,
          boxShadow: "var(--mantine-shadow-xl)",
          width: "320px",
          maxWidth: "90vw",
        }}
        className="bg-dark-9 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-dark-4 transition-all"
      >
        <Group
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="bg-dark-8 px-3 py-2 cursor-grab active:cursor-grabbing select-none border-b border-dark-4 flex justify-between items-center"
          justify="space-between"
          gap="xs"
        >
          <Group gap="xs" style={{ overflow: "hidden", flex: 1 }}>
            <MdDragIndicator className="text-gray-500 cursor-grab flex-shrink-0" size={18} />
            <Text size="sm" fw={500} truncate className="text-gray-200">
              {activeVideo.title}
            </Text>
          </Group>

          <Group gap={4} className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={maximizeVideo}
              title="Expand"
            >
              <MdOpenInFull size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red" size="sm" onClick={closeVideo} title="Close">
              <MdClose size={16} />
            </ActionIcon>
          </Group>
        </Group>

        <Box className="relative flex items-center justify-center bg-black overflow-hidden w-full">
          <div
            className="relative flex items-center justify-center w-full"
            style={{
              aspectRatio: "16/9",
            }}
          >
            <video
              ref={videoRef}
              src={playback?.url}
              controls
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="bg-black block w-full h-full object-contain"
            >
              <track kind="captions" />
            </video>
          </div>
        </Box>
      </FloatingWindow>
    );
  }

  return (
    <Modal
      opened={!isMinimized}
      onClose={closeVideo}
      withCloseButton={false}
      centered
      size="100%"
      zIndex={1000}
      styles={{
        root: {
          padding: 0,
        },
        inner: {
          padding: 0,
        },
        content: {
          backgroundColor: "transparent",
          boxShadow: "none",
          maxWidth: "100vw",
          maxHeight: "100vh",
          width: "100vw",
          height: "100vh",
          margin: 0,
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
        },
        body: {
          padding: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <Box
        className="bg-dark-9 flex flex-col overflow-hidden w-full h-full"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Group
          className="bg-dark-8 px-4 py-3 select-none border-b border-dark-4 flex justify-between items-center"
          justify="space-between"
          gap="xs"
        >
          <Group gap="xs" style={{ overflow: "hidden", flex: 1 }}>
            <Text size="md" fw={500} truncate className="text-gray-200">
              {activeVideo.title}
            </Text>
          </Group>

          <Group gap={8} className="flex-shrink-0">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="md"
              onClick={minimizeVideo}
              title="Minimize"
            >
              <MdMinimize size={20} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red" size="md" onClick={closeVideo} title="Close">
              <MdClose size={20} />
            </ActionIcon>
          </Group>
        </Group>

        <Box className="relative flex items-center justify-center overflow-hidden bg-red-500">
          <video
            ref={videoRef}
            src={playback?.url}
            controls
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="bg-black block max-w-full max-h-full object-fit m-auto"
            style={{
              width: "30vw",
              height: "100vh",
              margin: "0 auto",
            }}
          >
            <track
              className="bg-black block max-w-full max-h-full object-fit m-auto"
              kind="captions"
              style={{
                width: "30vw",
                height: "100vh",
                margin: "0auto",
              }}
            />
          </video>
        </Box>
      </Box>
    </Modal>
  );
}
