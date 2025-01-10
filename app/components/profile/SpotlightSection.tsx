'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { validateSpotlightItem, validateSpotlightImage } from '@/lib/validation'
import ImageUpload from '../ui/ImageUpload'
import ErrorBoundary from '../ui/ErrorBoundary'

export interface SpotlightItem {
  id: number
  title: string
  description: string
  image: string
  link: string
}

interface SpotlightSectionProps {
  items: SpotlightItem[]
  onItemChange: (index: number, field: keyof SpotlightItem, value: string) => void
  onAddItem: () => void
  onRemoveItem: (index: number) => void
  onImageChange: (index: number, file: File | null) => void
  isEditing?: boolean
  isUsingExampleContent?: boolean
}

interface SpotlightError {
  title: string;
  description: string;
  link: string;
  image: string;
}

const renderEditForm = (item: SpotlightItem, index: number, errors: SpotlightError[], handlers: {
  handleFieldChange: (index: number, field: keyof SpotlightItem, value: string) => void
  handleImageUpload: (index: number, file: File | null) => void
  onRemoveItem: (index: number) => void
}) => {
  return (
    <AccordionItem value={`spotlight-${index}`}>
      <AccordionTrigger className="flex justify-start gap-4 hover:no-underline">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {item.title || `Spotlight ${index + 1}`}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Card className="mb-4 p-4 bg-gray-700">
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`item-title-${index}`}>Title</Label>
              <Input
                id={`item-title-${index}`}
                value={item.title}
                onChange={(e) => handlers.handleFieldChange(index, 'title', e.target.value)}
                className={`mt-1 ${errors[index]?.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={!!errors[index]?.title}
                aria-describedby={errors[index]?.title ? `title-error-${index}` : undefined}
              />
              {errors[index]?.title && (
                <p className="text-sm text-red-500 mt-1" id={`title-error-${index}`}>
                  {errors[index].title}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`item-description-${index}`}>Description</Label>
              <Input
                id={`item-description-${index}`}
                value={item.description}
                onChange={(e) => handlers.handleFieldChange(index, 'description', e.target.value)}
                className={`mt-1 ${errors[index]?.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={!!errors[index]?.description}
                aria-describedby={errors[index]?.description ? `description-error-${index}` : undefined}
              />
              {errors[index]?.description && (
                <p className="text-sm text-red-500 mt-1" id={`description-error-${index}`}>
                  {errors[index].description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`item-image-${index}`}>Image</Label>
              <div className="mt-2">
                <ErrorBoundary>
                  <ImageUpload 
                    onImageUploaded={(file) => handlers.handleImageUpload(index, file)}
                    currentImage={item.image}
                  />
                </ErrorBoundary>
                {errors[index]?.image && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[index].image}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor={`item-link-${index}`}>Link (Optional)</Label>
              <Input
                id={`item-link-${index}`}
                value={item.link}
                onChange={(e) => handlers.handleFieldChange(index, 'link', e.target.value)}
                className={`mt-1 ${errors[index]?.link ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="https://..."
                aria-invalid={!!errors[index]?.link}
                aria-describedby={errors[index]?.link ? `link-error-${index}` : undefined}
              />
              {errors[index]?.link && (
                <p className="text-sm text-red-500 mt-1" id={`link-error-${index}`}>
                  {errors[index].link}
                </p>
              )}
            </div>

            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => handlers.onRemoveItem(index)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remove Item
            </Button>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  )
}

const SpotlightCard = ({ item, isEditing = false }: { item: SpotlightItem, isEditing?: boolean }) => {
  console.log('SpotlightCard render:', { title: item.title, link: item.link });
  return (
    <Card className={`w-full overflow-hidden group ${isEditing ? 'max-w-sm' : ''}`}>
      <CardContent className="p-0">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className={`relative ${isEditing ? 'aspect-[3/2]' : 'aspect-[16/9]'} w-full bg-gray-800`}>
            <Image
              src={item.image || '/images/next-event-placeholder.jpg'}
              alt={item.title || 'Spotlight image'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>
          <div className="p-4">
            <div className="font-semibold mb-2 text-lg">
              {item.title}
            </div>
            <div className="text-sm text-gray-400">
              {item.description}
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export function SpotlightSection({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onImageChange,
  isEditing = false,
}: SpotlightSectionProps) {
  const [errors, setErrors] = useState<SpotlightError[]>([]);

  const handleFieldChange = (index: number, field: keyof SpotlightItem, value: string) => {
    const validation = validateSpotlightItem(field, value);
    
    setErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = { 
        ...newErrors[index] || {},
        [field]: validation.message 
      };
      return newErrors;
    });

    if (validation.isValid) {
      onItemChange(index, field, value);
    }
  };

  const handleImageUpload = async (index: number, file: File | null) => {
    if (!file) return;

    const validation = validateSpotlightImage(file);
    
    setErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = { 
        ...newErrors[index] || {},
        image: validation.message 
      };
      return newErrors;
    });

    if (validation.isValid) {
      onImageChange(index, file);
    }
  };

  if (!isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id}>
            <SpotlightCard item={item} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Spotlight</h3>
        <p className="text-sm text-gray-400">
          Share anything you want to highlight - your work, collaborations, friends&apos; projects, or inspiring content. Supports all image formats including GIFs.
        </p>
      </div>
      
      {items.length > 0 && (
        <Accordion type="single" collapsible className="space-y-2">
          {items.map((item, index) => (
            <AccordionItem key={item.id} value={`spotlight-${index}`}>
              {renderEditForm(item, index, errors, {
                handleFieldChange,
                handleImageUpload,
                onRemoveItem
              })}
            </AccordionItem>
          ))}
        </Accordion>
      )}
      
      <Button type="button" onClick={onAddItem}>
        <Plus className="w-4 h-4 mr-2" /> Add Item
      </Button>
    </div>
  );
} 