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

// Simplified interface with clear props
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
  
  // Debug logging on mount
  useEffect(() => {
    console.log('MediaSection mounted with items:', {
      count: safeItems.length,
      items: safeItems
    });
  }, []);

  // Handle URL and field changes with appropriate transformations
  const handleMediaChange = useCallback((index: number, field: keyof MediaItemType, value: string) => {
    console.log('Handling media change:', { index, field, value });
    
    if (field === 'id' || field === 'rawUrl') {
      const cleanValue = value.trim();
      let mediaType = detectMediaType(cleanValue);
      let transformedUrl = cleanValue;

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

      // Update all related fields
      onChange(index, 'id', cleanValue);          // Use the original URL as ID
      onChange(index, 'type', mediaType);         // Set the detected media type
      onChange(index, 'rawUrl', cleanValue);      // Store the original URL
      onChange(index, 'embedUrl', transformedUrl); // Store the transformed URL for embedding
    } else {
      onChange(index, field, value);
    }
  }, [onChange]);

  // Convert MediaItemType to MediaItem for the MediaEmbed component
  const convertToMediaItem = (item: MediaItemType): MediaItem => ({
    ...item,
    type: item.type as MediaType,
    embedUrl: item.embedUrl || item.id, // Use embedUrl if available, fall back to id
    rawUrl: item.rawUrl || item.id
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Media</h2>
            <p className="text-sm text-gray-400 mt-2">
              Share your music, videos, DJ mixes, and playlists from YouTube, SoundCloud, Mixcloud, Spotify and Apple Music.
            </p>
          </div>
          <Button onClick={onAdd} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
        </div>

        {/* Simple Accordion for Media Items */}
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
                  {/* URL Input */}
                  <div>
                    <Label htmlFor={`media-url-${index}`}>Media URL</Label>
                    <div className="space-y-2">
                      <Input
                        id={`media-url-${index}`}
                        value={item.rawUrl || item.id || ''}
                        onChange={(e) => handleMediaChange(index, 'id', e.target.value)}
                        placeholder="Paste URL from YouTube, SoundCloud, Spotify, or Apple Music"
                      />
                      <p className="text-sm text-gray-400">
                        Supports: YouTube, Spotify, SoundCloud, Apple Music, and Mixcloud
                      </p>
                    </div>
                  </div>
                  
                  {/* Title Input */}
                  <div>
                    <Label>Title (Optional)</Label>
                    <Input
                      value={item.title || ''}
                      onChange={(e) => handleMediaChange(index, 'title', e.target.value)}
                      placeholder="Give your media a title"
                    />
                  </div>
                  
                  {/* Preview Embed (only show if we have a valid URL) */}
                  {item.id && (
                    <div className="mt-4 overflow-hidden">
                      <MediaEmbed item={convertToMediaItem(item)} />
                    </div>
                  )}
                  
                  {/* Remove Button */}
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
        
        {/* Empty State */}
        {safeItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No media items yet. Add one to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 