import React, { useState } from 'react';
import { SpotlightItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, GripVertical, Plus } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SpotlightEditorProps {
  items: SpotlightItem[];
  onSave: (items: SpotlightItem[]) => void;
  onCancel: () => void;
}

// Individual sortable item component
const SortableSpotlightItem = ({ 
  item, 
  onUpdate, 
  onDelete 
}: { 
  item: SpotlightItem; 
  onUpdate: (id: string, updates: Partial<SpotlightItem>) => void;
  onDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700"
    >
      {/* Drag handle */}
      <button
        className="mt-2 p-2 hover:bg-gray-700/50 rounded cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      {/* Image upload */}
      <ImageUpload
        currentImage={item.image}
        onImageChange={(imageDataUrl) => onUpdate(item.id, { image: imageDataUrl })}
        className="w-24 flex-shrink-0"
      />

      {/* Text fields */}
      <div className="flex-grow space-y-3">
        <input
          type="text"
          value={item.title}
          onChange={(e) => onUpdate(item.id, { title: e.target.value })}
          placeholder="Title"
          className="w-full bg-gray-900/50 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 placeholder:text-gray-500"
        />
        <input
          type="text"
          value={item.description}
          onChange={(e) => onUpdate(item.id, { description: e.target.value })}
          placeholder="Description"
          className="w-full bg-gray-900/50 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 placeholder:text-gray-500"
        />
        <input
          type="text"
          value={item.link}
          onChange={(e) => onUpdate(item.id, { link: e.target.value })}
          placeholder="Link"
          className="w-full bg-gray-900/50 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 placeholder:text-gray-500"
        />
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-red-400 hover:bg-red-950/20"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export const SpotlightEditor: React.FC<SpotlightEditorProps> = ({
  items: initialItems,
  onSave,
  onCancel,
}) => {
  const [items, setItems] = useState<SpotlightItem[]>(initialItems);
  
  // DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle item updates
  const handleUpdate = (id: string, updates: Partial<SpotlightItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // Handle item deletion
  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Handle drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Add new item
  const handleAddItem = () => {
    const newItem: SpotlightItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      link: ''
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Edit Spotlight Items</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="text-cyan-400 border-cyan-800 hover:bg-cyan-950/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <SortableSpotlightItem
                key={item.id}
                item={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={() => onSave(items)}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}; 