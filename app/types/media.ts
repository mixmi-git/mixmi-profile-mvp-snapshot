export interface MediaItem {
  id: string
  title?: string
  type: 'youtube' | 'soundcloud' | 'soundcloud-playlist' | 'spotify' | 'spotify-playlist' | 'apple-music-playlist' | 'apple-music-album' | 'apple-music-station' | 'mixcloud' | 'instagram-reel' | 'tiktok'
  embedUrl?: string
  rawUrl?: string
} 