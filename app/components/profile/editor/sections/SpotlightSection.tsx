'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { SpotlightItemType } from '../types/EditorTypes';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SpotlightError {
  title?: string;
  description?: string;
  link?: string;
  image?: string;
}

interface SpotlightSectionProps {
  items: SpotlightItemType[];
  onChange: (index: number, field: keyof SpotlightItemType, value: any) => void;
  onImageUpload: (index: number, file: File) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function SpotlightSection({
  items = [],
  onChange,
  onImageUpload,
  onAdd,
  onRemove
}: SpotlightSectionProps) {
  // Local validation errors state
  const [errors, setErrors] = useState<Record<number, SpotlightError>>({});
  
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  }, [items]);

  // Validate input fields
  const validateField = (field: keyof SpotlightItemType, value: string): { isValid: boolean, message: string } => {
    switch(field) {
      case 'title':
        if (!value.trim()) return { isValid: false, message: 'Title is required' };
        if (value.length > 100) return { isValid: false, message: 'Title must be less than 100 characters' };
        return { isValid: true, message: '' };
      case 'description':
        if (value.length > 300) return { isValid: false, message: 'Description must be less than 300 characters' };
        return { isValid: true, message: '' };
      case 'link':
        if (value && !value.match(/^https?:\/\/.+/)) return { isValid: false, message: 'Link must be a valid URL starting with http:// or https://' };
        return { isValid: true, message: '' };
      default:
        return { isValid: true, message: '' };
    }
  };

  const handleSpotlightChange = useCallback((index: number, field: keyof SpotlightItemType, value: string) => {
    // Validate the field
    const validation = validateField(field, value);
    
    // Update errors state
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: validation.isValid ? undefined : validation.message
      }
    }));
    
    // Only update if valid
    if (validation.isValid) {
      onChange(index, field, value);
    }
  }, [onChange]);

  const handleImageUpload = useCallback((index: number, file: File) => {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          image: 'Image size must be less than 5MB'
        }
      }));
      return;
    }

    onImageUpload(index, file);
    
    // Clear any previous error
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        image: undefined
      }
    }));
  }, [onImageUpload]);

  const handleRemoveSpotlight = useCallback((index: number) => {
    onRemove(index);
    
    // Remove errors for this index
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  }, [onRemove]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Spotlight</h2>
            <p className="text-sm text-gray-400 mt-2">
              Share anything you want to highlight - your work, collaborations, friends' projects, or inspiring content. Supports all image formats including GIFs.
            </p>
          </div>
          <Button onClick={onAdd} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {safeItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No spotlight items yet. Add one to get started!</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {safeItems.map((item, index) => (
              <AccordionItem key={item.id || index} value={item.id || `item-${index}`}>
                <AccordionTrigger className="hover:no-underline text-left">
                  <div className="flex items-center gap-2">
                    <span>{item.title || `Item ${index + 1}`}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={item.title || ''}
                        onChange={(e) => handleSpotlightChange(index, 'title', e.target.value)}
                        placeholder="Enter a title for this item"
                        className={errors[index]?.title ? "border-red-500" : ""}
                      />
                      {errors[index]?.title && (
                        <p className="text-xs text-red-500 mt-1">{errors[index]?.title}</p>
                      )}
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={item.description || ''}
                        onChange={(e) => handleSpotlightChange(index, 'description', e.target.value)}
                        className={`w-full px-3 py-2 bg-gray-800 border ${errors[index]?.description ? 'border-red-500' : 'border-gray-700'} rounded-md text-white`}
                        rows={3}
                        placeholder="Describe this item"
                      />
                      {errors[index]?.description && (
                        <p className="text-xs text-red-500 mt-1">{errors[index]?.description}</p>
                      )}
                    </div>
                    <div>
                      <Label>Image</Label>
                      <div className="mt-2">
                        <ImageUpload
                          currentImage={item.image || ''}
                          onUpload={(file) => handleImageUpload(index, file)}
                          className="w-full aspect-square"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Recommended: Square image. Supports JPEG, PNG, GIF (under 5MB)
                        </p>
                        {errors[index]?.image && (
                          <p className="text-xs text-red-500 mt-1">{errors[index]?.image}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Link (Optional)</Label>
                      <div className="relative">
                        <Input
                          value={item.link || ''}
                          onChange={(e) => handleSpotlightChange(index, 'link', e.target.value)}
                          placeholder="https://"
                          className={errors[index]?.link ? "border-red-500 pl-8" : "pl-8"}
                        />
                        <LinkIcon className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {errors[index]?.link && (
                          <p className="text-xs text-red-500 mt-1">{errors[index]?.link}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemoveSpotlight(index)}
                      variant="destructive"
                      size="sm"
                      className="w-full mt-4"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Item
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
} 