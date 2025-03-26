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
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface SpotlightEditorProps {
  items: SpotlightItem[];
  onSave: (items: SpotlightItem[]) => void;
  onCancel: () => void;
}

interface SortableSpotlightItemProps {
  item: SpotlightItem;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
}

// Individual sortable item component
const SortableSpotlightItem = ({ item, onUpdate, onDelete }: SortableSpotlightItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative rounded-lg bg-gray-800/50 border border-gray-700/50",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4">
        <button
          {...attributes}
          {...listeners}
          className="p-2 hover:bg-gray-700/50 rounded hidden sm:block"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        <div className="w-full sm:w-36 flex-shrink-0">
          <ImageUpload
            currentImage={item.image}
            onImageChange={(file) => onUpdate(item.id, 'image', file)}
            aspectRatio="square"
            className="rounded-md overflow-hidden"
          />
        </div>

        <div className="flex-grow space-y-2 min-w-0 w-full">
          <Input
            value={item.title}
            onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
            placeholder="Enter title"
            className="bg-gray-900/50"
          />
          <Input
            value={item.description}
            onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
            placeholder="Enter description"
            className="bg-gray-900/50"
          />
          <Input
            value={item.link}
            onChange={(e) => onUpdate(item.id, 'link', e.target.value)}
            placeholder="https://"
            className="bg-gray-900/50"
          />
        </div>

        <button
          onClick={() => onDelete(item.id)}
          className="absolute top-2 right-2 sm:static p-2 hover:bg-gray-700/50 rounded group"
        >
          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
        </button>
      </div>
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
  const handleUpdate = (id: string, field: string, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
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
    <div className="space-y-2">
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm py-2 z-10">
        <h2 className="text-xl font-medium text-white">Edit Spotlight Section</h2>
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
          <div className="space-y-1.5">
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

      <div className="flex justify-between items-center gap-3 pt-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="text-cyan-400 border-cyan-800 hover:bg-cyan-950/50 hover:text-cyan-300 hover:border-cyan-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onCancel} className="text-gray-300 hover:text-gray-100">
            Cancel
          </Button>
          <Button variant="default" onClick={() => onSave(items)} className="bg-cyan-600 hover:bg-cyan-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}; 