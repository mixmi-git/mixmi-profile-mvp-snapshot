'use client'

import { memo } from 'react'
import { MediaItem } from '@/types/media'

export const MediaEmbed = memo(({ item }: { item: MediaItem }) => {
  console.log('MediaEmbed received item:', item);
  console.log('MediaEmbed type:', item.type);
  console.log('MediaEmbed embedUrl:', item.embedUrl);

  if (!item.embedUrl) {
    console.log('No embedUrl provided');
    return null;
  }

  switch (item.type) {
    case 'youtube':
      const videoId = item.embedUrl.includes('embed/') 
        ? item.embedUrl.split('embed/')[1]
        : item.embedUrl.replace('https://www.youtube.com/embed/', '');
      
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      
      return (
        <div className="max-w-2xl mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
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
      const soundcloudHeight = item.type === 'soundcloud' ? '180' : '300';
      return (
        <div className="max-w-2xl mx-auto">
          <div style={{ height: soundcloudHeight + 'px' }} className="w-full">
            <iframe
              className="w-full h-full"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={item.embedUrl}
              style={{ background: 'transparent' }}
            />
          </div>
        </div>
      )
    case 'spotify':
    case 'spotify-playlist':
      const spotifyHeight = item.type === 'spotify' ? '152' : '380';
      return (
        <div className="max-w-2xl mx-auto">
          <div style={{ height: spotifyHeight + 'px' }}>
            <iframe
              className="w-full h-full"
              src={item.embedUrl}
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
      const appleMusicHeight = item.type === 'apple-music-playlist' ? '450' : '175';
      return (
        <div className="max-w-2xl mx-auto">
          <div style={{ height: appleMusicHeight + 'px' }}>
            <iframe
              className="w-full h-full"
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
              src={item.embedUrl}
            />
          </div>
        </div>
      )
    case 'mixcloud':
      return (
        <div className="max-w-2xl mx-auto">
          <div style={{ height: '180px' }}>
            <iframe
              className="w-full h-full"
              src={item.embedUrl}
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
    default:
      console.log('Unsupported media type:', item.type);
      return null
  }
})

MediaEmbed.displayName = 'MediaEmbed';