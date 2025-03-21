'use client';

import React, { useEffect, useCallback } from 'react';
import { ShopItemType } from '../types/EditorTypes';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import ImageUpload from '@/components/ui/ImageUpload';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ShopSectionProps {
  items: ShopItemType[];
  onChange: (index: number, field: keyof ShopItemType, value: any) => void;
  onImageUpload: (index: number, file: File) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function ShopSection({
  items = [],
  onChange,
  onImageUpload,
  onAdd,
  onRemove
}: ShopSectionProps) {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  const handleShopChange = useCallback((index: number, field: keyof ShopItemType, value: string) => {
    onChange(index, field, value);
  }, [onChange]);

  const handleImageUpload = useCallback((index: number, file: File) => {
    onImageUpload(index, file);
  }, [onImageUpload]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Shop</h2>
            <p className="text-sm text-gray-400 mt-2">
              Share anything you want to sell - physical products, digital downloads, token-gated content, or Web3 experiences. Supports all major platforms and custom links.
            </p>
          </div>
          <Button onClick={onAdd} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {safeItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No shop items yet. Add one to get started!</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {safeItems.map((item, index) => (
              <AccordionItem key={item.id || index} value={item.id || `item-${index}`}>
                <AccordionTrigger className="hover:no-underline text-left">
                  <div className="flex items-center gap-2">
                    <span>{item.title || `Item ${index + 1}`}</span>
                    {item.price && <span className="text-sm text-gray-400">({item.price})</span>}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={item.title || ''}
                        onChange={(e) => handleShopChange(index, 'title', e.target.value)}
                        placeholder="Enter product title"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={item.description || ''}
                        onChange={(e) => handleShopChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                        rows={3}
                        placeholder="Enter product description"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        value={item.price || ''}
                        onChange={(e) => handleShopChange(index, 'price', e.target.value)}
                        placeholder="Enter price (e.g., $25, 0.05 ETH, etc.)"
                      />
                    </div>
                    <div>
                      <Label>Link</Label>
                      <Input
                        value={item.link || ''}
                        onChange={(e) => handleShopChange(index, 'link', e.target.value)}
                        placeholder="https:// (where to buy this item)"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Enter the URL where people can purchase this item
                      </p>
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
                          Upload a square image for best results
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => onRemove(index)}
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