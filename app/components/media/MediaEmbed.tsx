'use client'

import { memo } from 'react'
import { MediaItem } from '@/types/media'

export const MediaEmbed = memo(({ item }: { item: MediaItem }) => {
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
      default:
        return 'pb-[56.25%]'
    }
  }

  switch (item.type) {
    case 'youtube':
      return (
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${item.id}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )
    case 'soundcloud':
    case 'soundcloud-playlist':
      return (
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
      )
    case 'spotify':
      return (
        <div className="relative pb-[152px] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://open.spotify.com/embed/track/${item.id}`}
            allow="encrypted-media"
          />
        </div>
      )
    case 'spotify-playlist':
      return (
        <div className={`relative ${getAspectRatio()} h-0`}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://open.spotify.com/embed/playlist/${item.id}`}
            allow="encrypted-media"
            loading="lazy"
            style={{ background: 'transparent' }}
          />
        </div>
      )
    case 'apple-music-album':
    case 'apple-music-playlist':
      return (
        <div className={`relative ${getAspectRatio()} h-0`}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            allow="autoplay *; encrypted-media *; fullscreen *"
            frameBorder="0"
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
      )
    default:
      return null
  }
})

MediaEmbed.displayName = 'MediaEmbed';