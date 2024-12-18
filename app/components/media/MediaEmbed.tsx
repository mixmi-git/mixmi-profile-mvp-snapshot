'use client'

import { memo } from 'react'
import { MediaItem } from '@/types/media'
import { Instagram } from 'lucide-react'

// Add custom TikTok icon component
const TikTokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-12 w-12"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export const MediaEmbed = memo(({ item }: { item: MediaItem }) => {
  console.log('MediaEmbed received item:', item);
  console.log('MediaEmbed type:', item.type);
  console.log('MediaEmbed id:', item.id);

  const getAspectRatio = () => {
    switch (item.type) {
      case 'youtube':
        return 'pb-[56.25%]' // 16:9 ratio
      case 'soundcloud':
        return 'pb-[300px]'  // Fixed height for tracks
      case 'soundcloud-playlist':
        return 'pb-[400px]'  // Taller height for playlists
      case 'spotify':
        return 'pb-[152px]'  // Single track
      case 'spotify-playlist':
        return 'pb-[380px]'  // Playlist height
      case 'apple-music-album':
        return 'pb-[175px]'  // Height for album
      case 'apple-music-playlist':
        return 'pb-[450px]'  // Height for playlist
      case 'apple-music-station':
        return 'pb-[175px]'  // Height for station
      case 'mixcloud':
        return 'pb-[400px]'  // Height for Mixcloud shows
      case 'instagram-reel':
        return 'pb-[125%]'  // Standard Instagram post aspect ratio
      case 'tiktok':
        return 'pb-[125%]'  // Standard TikTok post aspect ratio
      default:
        return 'pb-[56.25%]'
    }
  }

  switch (item.type) {
    case 'youtube':
      // If it's already an embed URL, extract the video ID
      const videoId = item.id.includes('embed/') 
        ? item.id.split('embed/')[1]
        : item.id.replace('https://www.youtube.com/embed/', '');
      
      console.log('YouTube videoId:', videoId);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      console.log('YouTube embedUrl:', embedUrl);
      
      return (
        <div className="max-w-2xl mx-auto">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title="YouTube video player"
              frameBorder="0"
            />
          </div>
        </div>
      )
    case 'soundcloud':
    case 'soundcloud-playlist':
      return (
        <div className="max-w-2xl mx-auto">
          <div className={`relative ${getAspectRatio()} h-0`}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={item.id}
              style={{ background: 'transparent' }}
            />
          </div>
        </div>
      )
    case 'spotify':
    case 'spotify-playlist':
      console.log('Spotify embed URL:', item.id);
      return (
        <div className="max-w-2xl mx-auto">
          <div className={`relative ${getAspectRatio()} h-0`}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={item.id}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ 
                background: 'transparent',
                borderRadius: '10px'
              }}
              frameBorder="0"
            />
          </div>
        </div>
      )
    case 'apple-music-album':
    case 'apple-music-playlist':
    case 'apple-music-station':
      return (
        <div className="max-w-2xl mx-auto">
          <div className={`relative ${getAspectRatio()} h-0`}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay *; encrypted-media *; fullscreen *"
              frameBorder="0"
              height="450"
              style={{
                width: '100%',
                maxWidth: '660px',
                overflow: 'hidden',
                background: 'transparent',
                borderRadius: '10px'
              }}
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={item.id}
            />
          </div>
        </div>
      )
    case 'mixcloud':
      return (
        <div className="max-w-2xl mx-auto">
          <div className={`relative ${getAspectRatio()} h-0`}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={item.id}
              frameBorder="0"
              allow="autoplay"
              loading="lazy"
              style={{
                background: 'transparent',
                borderRadius: '10px'
              }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      )
    case 'instagram-reel':
      return (
        <div className="max-w-2xl mx-auto">
          <div className={`relative ${getAspectRatio()} h-0`}>
            <a 
              href={item.id}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors group"
            >
              <div className="text-center">
                <Instagram className="w-12 h-12 mx-auto mb-2 text-pink-500" />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  Watch on Instagram
                </span>
              </div>
            </a>
          </div>
        </div>
      )
    case 'tiktok':
      return (
        <div className="max-w-2xl mx-auto">
          <div className={`relative ${getAspectRatio()} h-0`}>
            <a 
              href={item.id}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors group"
            >
              <div className="text-center">
                <TikTokIcon className="w-12 h-12 mx-auto mb-2 text-[#ff0050]" />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  Watch on TikTok
                </span>
              </div>
            </a>
          </div>
        </div>
      )
    default:
      return null
  }
})

MediaEmbed.displayName = 'MediaEmbed';