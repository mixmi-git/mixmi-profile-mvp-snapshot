import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { MediaItem, MediaType } from '@/types/media';
import { MediaEmbed } from '@/components/media/MediaEmbed';
import { detectMediaType, transformMediaUrl } from '@/lib/mediaUtils';

interface MediaEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  onSave: (items: MediaItem[]) => void;
}

export function MediaEditorModal({
  isOpen,
  onClose,
  items = [],
  onSave,
}: MediaEditorModalProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(items);
  const [error, setError] = useState<string | null>(null);

  // Add a new empty media item
  const addMediaItem = () => {
    if (mediaItems.length >= 3) return;
    setMediaItems([...mediaItems, { id: '', type: 'youtube' as MediaType, rawUrl: '' }]);
  };

  // Remove a media item
  const removeMediaItem = (index: number) => {
    setMediaItems(mediaItems.filter((_, i) => i !== index));
  };

  // Handle URL change and auto-detect platform
  const handleUrlChange = (index: number, url: string) => {
    try {
      const type = detectMediaType(url) as MediaType;
      const embedUrl = transformMediaUrl(url, type);
      setError(null);
      // Success handling
      const updatedItems = [...mediaItems];
      updatedItems[index] = {
        id: url,
        type,
        rawUrl: url,
        embedUrl
      };
      setMediaItems(updatedItems);
    } catch (error) {
      setError("Couldn't process this URL. Please check that it's a valid share URL.");
    }
  };

  // Move an item up or down in the list
  const moveItem = (from: number, to: number) => {
    const newItems = [...mediaItems];
    const [removed] = newItems.splice(from, 1);
    newItems.splice(to, 0, removed);
    setMediaItems(newItems);
  };

  const handleSave = () => {
    try {
      const validItems = mediaItems.filter(item => item.rawUrl && item.type);
      onSave(validItems);
      setError(null);
      onClose();
    } catch (error) {
      setError("Couldn't save your changes. Please try again.");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newItems = Array.from(mediaItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    setMediaItems(newItems);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-white">
            Edit Media Items
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add (up to 3) or remove media from YouTube, SoundCloud, Spotify, and more. Just paste the share URL and we'll handle the rest.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Media Items List */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="media-items">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {mediaItems.map((item, index) => (
                    <Draggable 
                      key={index} 
                      draggableId={`media-${index}`} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-start gap-4 group bg-gray-800/50 p-4 rounded-lg ${
                            snapshot.isDragging ? 'opacity-50' : ''
                          }`}
                        >
                          {/* Drag Handle */}
                          <div 
                            {...provided.dragHandleProps}
                            className="mt-3 cursor-move"
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>

                          <div className="flex-1 space-y-4">
                            {/* URL Input */}
                            <div>
                              <Label htmlFor={`media-url-${index}`} className="text-sm text-gray-300">
                                Share URL
                              </Label>
                              <Input
                                id={`media-url-${index}`}
                                value={item.rawUrl || ''}
                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                placeholder="Paste URL from YouTube, SoundCloud, etc."
                                className="bg-gray-800 border-gray-700 mt-1"
                              />
                            </div>

                            {/* Preview (if URL is valid) */}
                            {item.embedUrl && (
                              <div className="mt-2">
                                <MediaEmbed item={item} />
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMediaItem(index)}
                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Add Button */}
          <Button
            onClick={addMediaItem}
            variant="outline"
            className="w-full border-dashed border-gray-700 hover:border-gray-600 bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-800"
            disabled={mediaItems.length >= 3}
          >
            <Plus className="w-4 h-4 mr-2" />
            {mediaItems.length >= 3 ? 'Maximum 3 items reached' : 'Add Media'}
          </Button>

          {/* Save & Cancel Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-300 hover:text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 