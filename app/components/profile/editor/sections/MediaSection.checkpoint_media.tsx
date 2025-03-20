'use client';

import React, { useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { getMediaDisplayName, transformSoundCloudUrl, transformAppleMusicUrl, detectMediaType, transformMixcloudUrl, transformInstagramUrl, transformTikTokUrl, transformYouTubeUrl } from '@/lib/mediaUtils';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@/components/ui/accordion";
import { MediaEmbed } from "@/components/media/MediaEmbed";
import { MediaItemType } from '../../UserProfileContainer';
import { MediaType, MediaItem } from '@/types/media';

interface MediaSectionProps {
  items: MediaItemType[];
  onChange: (index: number, field: keyof MediaItemType, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function MediaSection({
  items = [],
  onChange,
  onAdd,
  onRemove
}: MediaSectionProps) {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  
  // Debug logging
  useEffect(() => {
    console.log('🎵 MediaSection mounted with items:', {
      itemsLength: safeItems.length,
      isArray: Array.isArray(items),
      items: safeItems,
      firstItem: safeItems[0],
      componentStack: new Error().stack
    });
  }, [items]);

  useEffect(() => {
    console.log('🎵 MediaSection items updated:', {
      itemsLength: safeItems.length,
      isArray: Array.isArray(items),
      items: safeItems,
      firstItem: safeItems[0]
    });
  }, [items]);

  const handleMediaChange = useCallback((index: number, field: keyof MediaItemType, value: string) => {
    console.log('🎵 Handling media change:', { index, field, value });
    
    if (field === 'id') {
      console.log('Processing URL:', value); // Debug log
      
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

      // Update the media item with all the new values
      onChange(index, 'id', transformedUrl);
      onChange(index, 'type', mediaType);
      onChange(index, 'rawUrl', cleanValue); // Store the original URL
    } else {
      onChange(index, field, value);
    }
  }, [onChange]);

  // Convert MediaItemType to MediaItem for the MediaEmbed component
  const convertToMediaItem = (item: MediaItemType): MediaItem => ({
    ...item,
    type: item.type as MediaType,
    embedUrl: item.id, // Use the id as the embedUrl
    rawUrl: item.rawUrl || item.id
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Media</h2>
            <p className="text-sm text-gray-400 mt-2">
              Share your music, videos, DJ mixes, and playlists from YouTube, SoundCloud, Mixcloud, Spotify and Apple Music. Supports all formats.
            </p>
          </div>
          <Button onClick={onAdd} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {safeItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline text-left">
                <div className="flex items-center gap-2">
                  <span>{item.title || getMediaDisplayName(item.rawUrl || item.id || '')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor={`media-url-${index}`}>Media URL</Label>
                    <div className="space-y-2">
                      <Input
                        id={`media-url-${index}`}
                        value={item.rawUrl || item.id || ''}
                        onChange={(e) => handleMediaChange(index, 'id', e.target.value)}
                        placeholder="Paste URL from YouTube, SoundCloud, Spotify, or Apple Music"
                        onFocus={(e) => e.target.select()}
                      />
                      <p className="text-sm text-gray-400">
                        Supports: YouTube, Spotify, SoundCloud, Apple Music, and Mixcloud
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Title (Optional)</Label>
                    <Input
                      value={item.title || ''}
                      onChange={(e) => handleMediaChange(index, 'title', e.target.value)}
                      placeholder="Give your media a title"
                    />
                  </div>
                  
                  {item.id && (
                    <div className="mt-4 overflow-hidden">
                      <MediaEmbed item={convertToMediaItem(item)} />
                    </div>
                  )}
                  
                  <Button
                    onClick={() => onRemove(index)}
                    variant="destructive"
                    size="sm"
                    className="w-full mt-4"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Media
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {safeItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No media items yet. Add one to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 