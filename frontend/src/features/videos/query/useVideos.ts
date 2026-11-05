import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadVideo } from "@/features/videos/api/uploadVideo";
import {
  getPlaybackUrl,
  listVideos,
  deleteVideo,
  updateVideo,
  getVideo,
  type Video,
} from "@/features/videos/api/videos";
import { videoKeys, folderKeys } from "@/shared/api/keys";
import { useToastStore } from "@/store/useToastStore";

const PROCESSING_POLL_MS = 20000;

export function useVideos(limit = 50, offset = 0, initialData?: Video[]) {
  return useQuery<Video[]>({
    queryKey: videoKeys.list(limit, offset),
    queryFn: () => listVideos(limit, offset),
    initialData,
    refetchInterval: (query: { state: { data?: Video[] } }) =>
      query.state.data?.some((video) => video.status === "processing") ? PROCESSING_POLL_MS : false,
  });
}

export function useVideo(videoId: string) {
  return useQuery({
    queryKey: videoKeys.detail(videoId),
    queryFn: () => getVideo(videoId),
    enabled: !!videoId,
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.success);

  return useMutation({
    mutationFn: ({
      videoId,
      patch,
    }: {
      videoId: string;
      patch: Partial<Pick<Video, "title" | "notes">>;
    }) => updateVideo(videoId, patch),
    onSuccess: () => {
      showToast("Video updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

export function useUploadVideo() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.success);

  return useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => {
      showToast("Video uploaded successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.success);

  return useMutation({
    mutationFn: (videoId: string) => deleteVideo(videoId),
    onSuccess: () => {
      showToast("Video deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

/** The signed URL is only refetched on demand (after a playback error), not on a timer. */
export function usePlaybackUrl(videoId: string, enabled: boolean) {
  return useQuery({
    queryKey: videoKeys.playbackUrl(videoId),
    queryFn: () => getPlaybackUrl(videoId),
    enabled,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
