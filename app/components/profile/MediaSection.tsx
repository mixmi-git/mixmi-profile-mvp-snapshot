'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { getMediaDisplayName, transformSoundCloudUrl, transformAppleMusicUrl, detectMediaType, transformMixcloudUrl, transformInstagramUrl, transformTikTokUrl, transformYouTubeUrl } from '@/lib/mediaUtils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MediaEmbed } from "@/components/media/MediaEmbed"

interface MediaItem {
  id: string
  title?: string
  type: 'youtube' | 'soundcloud' | 'soundcloud-playlist' | 'spotify' | 'spotify-playlist' | 'apple-music-playlist' | 'apple-music-album' | 'apple-music-station' | 'mixcloud' | 'instagram-reel' | 'tiktok'
  embedUrl?: string
  rawUrl?: string
}

interface MediaSectionProps {
  mediaItems: MediaItem[]
  onMediaChange: (index: number, field: string, value: string) => void
  onAddMedia: () => void
  onRemoveMedia: (index: number) => void
} 

export function MediaSection({
  mediaItems,
  onMediaChange,
  onAddMedia,
  onRemoveMedia
}: MediaSectionProps) {
  const handleMediaChange = (index: number, field: string, value: string) => {
    if (field === 'id') {
      console.log('Processing URL:', value);  // Debug log
      
      const cleanValue = value.trim().replace(/^h+ttps:\/\//, 'https://');
      console.log('2. Cleaned value:', cleanValue);
      
      let transformedUrl = cleanValue;
      let mediaType = detectMediaType(cleanValue);
      console.log('3. Initial media type:', mediaType);

      // Check for iframe code first
      if (cleanValue.includes('<iframe')) {
        console.log('4. Found iframe code');
        const srcMatch = cleanValue.match(/src="([^"]+)"/);
        if (srcMatch) {
          transformedUrl = srcMatch[1];
          console.log('5. Extracted src URL:', transformedUrl);
          mediaType = detectMediaType(transformedUrl);
          console.log('6. Updated media type:', mediaType);
        }
      }

      // Transform URL based on detected type
      if (mediaType.includes('soundcloud')) {
        transformedUrl = transformSoundCloudUrl(cleanValue);
      } else if (mediaType.includes('apple-music')) {
        transformedUrl = transformAppleMusicUrl(cleanValue);
      } else if (mediaType === 'mixcloud') {
        transformedUrl = transformMixcloudUrl(cleanValue);
      } else if (mediaType === 'instagram-reel') {
        transformedUrl = transformInstagramUrl(cleanValue);
      } else if (mediaType === 'tiktok') {
        transformedUrl = transformTikTokUrl(cleanValue);
      } else if (mediaType === 'youtube') {
        transformedUrl = transformYouTubeUrl(cleanValue);
      }

      console.log('7. Final mediaType:', mediaType);
      console.log('8. Final transformedUrl:', transformedUrl);

      const updates = {
        type: mediaType,
        id: transformedUrl,
        rawUrl: cleanValue
      };

      // Apply all updates at once
      Object.entries(updates).forEach(([key, value]) => {
        onMediaChange(index, key, value);
      });
    } else {
      onMediaChange(index, field, value);
    }
  };

  return (
    <div className="space-y-8 pt-8 border-t border-gray-700">
      <div>
        <h3 className="text-xl font-semibold">Media</h3>
        <p className="text-sm text-gray-400 mt-2">
          Share your music, videos, and playlists from YouTube, SoundCloud, Spotify, and Apple Music.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {mediaItems.map((media, index) => (
          <AccordionItem key={index} value={`media-${index}`}>
            <AccordionTrigger className="text-left">
              {media.id ? getMediaDisplayName(media.rawUrl || '') : `New Media`}
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mb-4 p-4 bg-gray-700">
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`media-url-${index}`}>Media URL</Label>
                    <div className="space-y-2">
                      <Input
                        id={`media-url-${index}`}
                        defaultValue={media.rawUrl || ""}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          handleMediaChange(index, 'id', inputValue);
                        }}
                        placeholder="Paste URL from YouTube, SoundCloud, Spotify, or Apple Music"
                        onFocus={(e) => e.target.select()}
                      />
                      <p className="text-sm text-gray-400">
                        Supports: 
                        • YouTube, Spotify, SoundCloud, Apple Music (plays directly on your profile)
                        • Instagram Reels, TikTok videos (links to original platform)
                        <br/>
                        For TikTok: Share > Copy Link
                        <br/>
                        For SoundCloud: Click Share > Embed > Copy the entire embed code
                      </p>
                    </div>
                    {media.id && (
                      <div className="mt-4 border border-gray-700 rounded-lg overflow-hidden">
                        <MediaEmbed item={{
                          ...media,
                          id: media.type === 'youtube' ? media.id.replace('https://www.youtube.com/embed/', '') : media.id
                        }} />
                      </div>
                    )}
                  </div>
                  <Button type="button" variant="destructive" onClick={() => onRemoveMedia(index)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Remove Media
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button type="button" onClick={onAddMedia} className="mt-2">
        <Plus className="w-4 h-4 mr-2" /> Add Media
      </Button>
    </div>
  )
} 