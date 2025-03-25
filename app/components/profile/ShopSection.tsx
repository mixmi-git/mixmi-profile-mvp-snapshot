'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import ImageUpload from '../ui/ImageUpload'
import { ShopItem } from '@/types'

interface ShopSectionProps {
  items: ShopItem[]
  onItemChange: (index: number, field: keyof ShopItem, value: string) => void
  onAddItem: () => void
  onRemoveItem: (index: number) => void
  onImageChange: (index: number, file: File | null) => void
  isEditing: boolean
  isUsingExampleContent?: boolean
}

export function ShopSection({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onImageChange,
  isEditing
}: ShopSectionProps) {
  if (!isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">Shop</h3>
        <p className="text-sm text-gray-400 mt-2">
          Share anything you want to sell - physical products, digital downloads, token-gated content, or Web3 experiences. Supports all major platforms and custom links.
        </p>
      </div>
      
      <div className="space-y-4">
        {items.length === 0 ? (
          <Button
            onClick={onAddItem}
            className="bg-white hover:bg-gray-100 text-gray-900 rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Store
          </Button>
        ) : (
          <>
            {items.map((item, index) => (
              <Card key={item.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`store-title-${index}`}>Store Title</Label>
                      <Input
                        id={`store-title-${index}`}
                        value={item.title}
                        onChange={(e) => onItemChange(index, 'title', e.target.value)}
                        placeholder="Enter store title"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`store-url-${index}`}>Store URL</Label>
                      <Input
                        id={`store-url-${index}`}
                        value={item.link}
                        onChange={(e) => onItemChange(index, 'link', e.target.value)}
                        placeholder="https://"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Store Image</Label>
                      <div className="mt-2">
                        <ImageUpload
                          currentImage={item.image}
                          onImageUploaded={(file) => onImageChange(index, file)}
                        />
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => onRemoveItem(index)}
                      className="w-full mt-4"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Store
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={onAddItem}
              className="bg-white hover:bg-gray-100 text-gray-900 rounded-md flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Store
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export const ShopItemCard = ({ item }: { item: ShopItem }) => {
  return (
    <Card className="w-full overflow-hidden group">
      <CardContent className="p-0">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative aspect-[4/3] w-full bg-gray-800">
            <Image
              src={item.image || '/images/shop-placeholder.jpg'}
              alt={item.title || 'Store image'}
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>
          <div className="p-4">
            <div className="font-semibold mb-2 text-lg line-clamp-2 whitespace-pre-wrap break-words">
              {item.title || 'Untitled Store'}
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  )
} 