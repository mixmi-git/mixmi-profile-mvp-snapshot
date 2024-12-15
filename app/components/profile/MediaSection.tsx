'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { getMediaDisplayName } from "@/lib/utils"
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
  type: 'youtube' | 'soundcloud' | 'soundcloud-playlist' | 'spotify' | 'spotify-playlist' | 'apple-music-playlist' | 'apple-music-album'
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
              {media.id ? getMediaDisplayName(media.rawUrl || '', media.type) : `New Media`}
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mb-4 p-4 bg-gray-700">
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`media-url-${index}`}>Media URL</Label>
                    <div className="space-y-2">
                      <Input
                        id={`media-url-${index}`}
                        value={media.rawUrl || media.id}
                        onChange={(e) => onMediaChange(index, 'id', e.target.value)}
                        placeholder="Paste URL from YouTube, SoundCloud, Spotify, or Apple Music"
                      />
                      <p className="text-xs text-gray-400">
                        Supports: YouTube videos, SoundCloud tracks & playlists, Spotify tracks & playlists, Apple Music playlists
                      </p>
                    </div>
                    {media.id && (
                      <div className="mt-4 border border-gray-700 rounded-lg overflow-hidden">
                        <MediaEmbed item={media} />
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