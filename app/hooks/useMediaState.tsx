import { useState, useCallback, useEffect } from "react"
import { MediaItem, MediaType } from "@/types/media"
import { 
  transformSoundCloudUrl, 
  transformAppleMusicUrl, 
  detectMediaType, 
  transformMixcloudUrl,
  transformSpotifyUrl
} from '@/lib/mediaUtils'

// This hook manages the state and operations related to media items
export function useMediaState(initialMediaItems: MediaItem[] = []) {
  // State
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems)
  const [videosLoading, setVideosLoading] = useState(true)
  
  // Load media items effect - simulates loading state
  useEffect(() => {
    setTimeout(() => setVideosLoading(false), 1200)
  }, [])

  // Add a new media item
  const addMedia = useCallback(() => {
    setMediaItems(prev => [...prev, {
      id: '',
      type: 'youtube' as MediaType,
      rawUrl: ''
    }])
  }, [])
  
  // Remove a media item by index
  const removeMedia = useCallback((index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index))
  }, [])
  
  // Handle changes to a media item's properties
  const handleMediaChange = useCallback((index: number, field: string, value: string) => {
    if (field === 'rawUrl') {
      // When changing the URL, also detect and update the media type
      const mediaType = detectMediaType(value)
      
      let embedUrl = value
      let transformedId = ''
      
      // Transform URLs based on media type
      if (mediaType === 'soundcloud' || mediaType === 'soundcloud-playlist') {
        transformedId = transformSoundCloudUrl(value)
      } else if (mediaType.startsWith('apple-music')) {
        transformedId = transformAppleMusicUrl(value)
      } else if (mediaType === 'mixcloud') {
        transformedId = transformMixcloudUrl(value)
      } else if (mediaType.startsWith('spotify')) {
        transformedId = transformSpotifyUrl(value)
      } else if (mediaType === 'youtube') {
        // For YouTube, extract the video ID from the URL
        const videoId = extractYouTubeId(value)
        transformedId = videoId
      }
      
      setMediaItems(prev => {
        const newItems = [...prev]
        newItems[index] = {
          ...newItems[index],
          type: mediaType,
          rawUrl: value,
          id: transformedId
        }
        return newItems
      })
    } else {
      // For other fields, just update the value
      setMediaItems(prev => {
        const newItems = [...prev]
        newItems[index] = {
          ...newItems[index],
          [field]: value
        }
        return newItems
      })
    }
  }, [])
  
  // Helper function to extract YouTube video ID
  const extractYouTubeId = (url: string): string => {
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const ytMatch = url.match(ytRegex)
    return ytMatch ? ytMatch[1] : url
  }
  
  return {
    mediaItems,
    setMediaItems,
    videosLoading,
    addMedia,
    removeMedia,
    handleMediaChange
  }
} 