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
import { Textarea } from '@/components/ui/textarea';
import { Plus, GripVertical, Trash2, ExternalLink } from 'lucide-react';
import { SpotlightItem } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';

interface SpotlightEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SpotlightItem[];
  onSave: (items: SpotlightItem[]) => void;
}

export function SpotlightEditorModal({
  isOpen,
  onClose,
  items = [],
  onSave,
}: SpotlightEditorModalProps) {
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItem[]>(items);

  const addSpotlightItem = () => {
    if (spotlightItems.length >= 3) return;
    setSpotlightItems([...spotlightItems, { 
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      link: ''
    }]);
  };

  const removeSpotlightItem = (index: number) => {
    setSpotlightItems(spotlightItems.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newItems = Array.from(spotlightItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    setSpotlightItems(newItems);
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const updatedItems = [...spotlightItems];
        updatedItems[index] = { ...updatedItems[index], image: e.target.result as string };
        setSpotlightItems(updatedItems);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (index: number, field: keyof SpotlightItem, value: string) => {
    const updatedItems = [...spotlightItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setSpotlightItems(updatedItems);
  };

  const handleSave = () => {
    const validItems = spotlightItems.filter(item => item.title || item.description || item.image || item.link);
    onSave(validItems);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-white">
            Edit Spotlight Section
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add up to 3 items to showcase your work
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="spotlight-items">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {spotlightItems.map((item, index) => (
                    <Draggable 
                      key={item.id} 
                      draggableId={item.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex gap-3 group bg-gray-800/50 rounded-lg p-3 ${
                            snapshot.isDragging ? 'opacity-50' : ''
                          }`}
                        >
                          <div {...provided.dragHandleProps} className="mt-14">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>

                          <div className="flex-1 space-y-3">
                            <ImageUpload
                              currentImage={item.image}
                              onUpload={(file) => handleImageUpload(index, file)}
                              className="w-full aspect-square"
                            />

                            <Input
                              value={item.title}
                              onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                              placeholder="Title"
                              className="bg-gray-800 border-gray-700"
                            />

                            <Textarea
                              value={item.description}
                              onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                              placeholder="Description"
                              className="bg-gray-800 border-gray-700 min-h-[60px]"
                            />

                            <div className="flex gap-2">
                              <Input
                                value={item.link}
                                onChange={(e) => handleFieldChange(index, 'link', e.target.value)}
                                placeholder="Link (optional)"
                                className="bg-gray-800 border-gray-700"
                              />
                              {item.link && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => window.open(item.link, '_blank')}
                                  className="shrink-0"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSpotlightItem(index)}
                            className="text-red-400 hover:text-red-300 h-8 w-8"
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

          <Button
            onClick={addSpotlightItem}
            variant="outline"
            className="w-full border-dashed border-gray-700 hover:border-gray-600 bg-gray-800/50 text-gray-300 hover:text-white"
            disabled={spotlightItems.length >= 3}
          >
            <Plus className="w-4 h-4 mr-2" />
            {spotlightItems.length >= 3 ? 'Maximum 3 items reached' : 'Add Item'}
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
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
      </DialogContent>
    </Dialog>
  );
} 