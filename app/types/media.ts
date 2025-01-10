export type MediaType = 'youtube' | 'soundcloud' | 'soundcloud-playlist' | 'spotify' | 'spotify-playlist' | 'apple-music-playlist' | 'apple-music-album' | 'apple-music-station' | 'mixcloud';

export interface MediaItem {
  id: string
  title?: string
  type: MediaType
  embedUrl?: string
  rawUrl?: string
} 