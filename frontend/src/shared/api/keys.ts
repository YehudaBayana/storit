export const playlistKeys = {
  popularPlaylists: () => ["popular-playlists"] as const,
  playlistDetails: (playlistId: string) => ["playlist-details", playlistId] as const,
  playlistTracks: (playlistId: string) => ["playlist-tracks", playlistId] as const,
};

export const searchKeys = {
  searchBy: (searchTerm: string) => ["search-by", searchTerm] as const,
};

export const historyKeys = {
  getHistory: () => ["get-history"] as const,
};

export const authKeys = {
  all: ["auth"] as const,
  login: (email: string) => ["auth", "login", email] as const,
  me: () => ["auth", "me"] as const,
};

export const likedKeys = {
  getLiked: () => ["get-liked"] as const,
};

export const videoKeys = {
  all: ["videos"] as const,
  lists: () => [...videoKeys.all, "list"] as const,
  list: (limit: number, offset: number) => ["videos", "list", limit, offset] as const,
  detail: (videoId: string) => ["videos", "detail", videoId] as const,
  playbackUrl: (videoId: string) => ["videos", "playback-url", videoId] as const,
  thumbnail: (videoId: string) => ["videos", "thumbnail", videoId] as const,
};

export const folderKeys = {
  all: ["folders"] as const,
  lists: () => [...folderKeys.all, "list"] as const,
  contents: (id: string) => [...folderKeys.all, "contents", id] as const,
  trash: () => [...folderKeys.all, "trash"] as const,
};
