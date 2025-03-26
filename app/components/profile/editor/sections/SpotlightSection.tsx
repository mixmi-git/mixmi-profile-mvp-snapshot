'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { SpotlightItem } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import Image from "next/image";
import ImageUpload from '@/components/ui/ImageUpload';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SpotlightError {
  title?: string;
  description?: string;
  link?: string;
  image?: string;
}

interface SpotlightSectionProps {
  items: SpotlightItem[];
  onChange: (items: SpotlightItem[]) => void;
  onImageUpload: (index: number, file: File) => void;
}

// Sortable item component
const SortableSpotlightItem = ({ 
  item, 
  index,
  onUpdate,
  onRemove,
  onImageUpload 
}: { 
  item: SpotlightItem;
  index: number;
  onUpdate: (index: number, field: keyof SpotlightItem, value: string) => void;
  onRemove: (index: number) => void;
  onImageUpload: (index: number, file: File) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div {...attributes} {...listeners} className="cursor-move">
            <GripVertical className="h-5 w-5 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium">Item {index + 1}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => onUpdate(index, 'title', e.target.value)}
                  placeholder="Enter title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => onUpdate(index, 'description', e.target.value)}
                  placeholder="Enter description"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Link</Label>
                <Input
                  value={item.link}
                  onChange={(e) => onUpdate(index, 'link', e.target.value)}
                  placeholder="https://"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Image</Label>
              <div className="mt-2 space-y-2">
                <ImageUpload
                  currentImage={item.image}
                  onUpload={(file) => onImageUpload(index, file)}
                />
                {item.image && (
                  <div className="relative aspect-square w-full max-w-[200px] rounded-lg overflow-hidden bg-gray-900">
                    <Image
                      src={item.image}
                      alt={item.title || 'Spotlight image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SpotlightSection({
  items,
  onChange,
  onImageUpload
}: SpotlightSectionProps) {
  // Track if this is first edit to handle placeholder content
  const [hasInitialized, setHasInitialized] = useState(false);

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize editing by clearing placeholders if needed
  const initializeEditing = useCallback(() => {
    if (!hasInitialized) {
      // If we only have placeholder content, clear it
      if (items.every(item => item.isPlaceholder)) {
        onChange([{
          id: Date.now().toString(),
          title: '',
          description: '',
          image: '',
          link: '',
          isPlaceholder: false
        }]);
      }
      setHasInitialized(true);
    }
  }, [hasInitialized, items, onChange]);

  // Handle adding a new item
  const handleAddItem = useCallback(() => {
    onChange([...items, {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      link: '',
      isPlaceholder: false
    }]);
  }, [items, onChange]);

  // Handle updating an item
  const handleUpdateItem = useCallback((index: number, field: keyof SpotlightItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  }, [items, onChange]);

  // Handle removing an item
  const handleRemoveItem = useCallback((index: number) => {
    onChange(items.filter((_, i) => i !== index));
  }, [items, onChange]);

  // Handle drag end for reordering
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id.toString() === active.id);
      const newIndex = items.findIndex(item => item.id.toString() === over.id);
      
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  }, [items, onChange]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Spotlight</h2>
            <p className="text-sm text-gray-400 mt-2">
              Share anything you want to highlight - your work, collaborations, or inspiring content
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map(item => item.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, index) => (
                <SortableSpotlightItem
                  key={item.id}
                  item={item}
                  index={index}
                  onUpdate={handleUpdateItem}
                  onRemove={handleRemoveItem}
                  onImageUpload={onImageUpload}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button
            onClick={handleAddItem}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Spotlight Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 