'use client'

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
import ImageUpload from '../ui/ImageUpload';

export type ShopPlatform = 'shopify' | 'etsy' | 'gumroad' | 'bigcartel' | 'other'

export interface ShopItem {
  id: string
  title: string
  storeUrl: string
  image: string
  platform: ShopPlatform
  description?: string
}

interface ShopSectionProps {
  shopItems: ShopItem[]
  onShopItemChange: (index: number, field: string, value: string) => void
  onAddShopItem: () => void
  onRemoveShopItem: (index: number) => void
  onImageChange: (index: number, file: File | null) => void
  isEditing?: boolean
}

const defaultProductImage = "/images/shop-placeholder.jpg"

export const ShopItemCard = ({ item, isEditing = false }: { item: ShopItem, isEditing?: boolean }) => {
  return (
    <Card className={`w-full overflow-hidden group ${isEditing ? 'max-w-sm' : ''}`}>
      <CardContent className="p-0">
        <a
          href={item.storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className={`relative ${isEditing ? 'aspect-[3/2]' : 'aspect-[4/3]'} w-full bg-gray-800`}>
            <Image
              src={item.image || defaultProductImage}
              alt={item.title || 'Product image'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>
          <div className="p-4">
            <div className="font-semibold mb-2 text-lg">
              {item.title || 'Untitled Product'}
            </div>
            <div className="text-sm text-gray-400">
              Visit Store
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  )
}

export function ShopSection({
  shopItems,
  onShopItemChange,
  onAddShopItem,
  onRemoveShopItem,
  onImageChange,
  isEditing = true
}: ShopSectionProps) {
  if (!isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-8 border-t border-gray-700">
      <div>
        <h3 className="text-xl font-semibold">Shop</h3>
        <p className="text-sm text-gray-400 mt-2">
          Connect your online store from Shopify, Etsy, or other platforms to showcase your products, merchandise, and token-gated content
        </p>
      </div>
      <Accordion type="single" collapsible>
        {shopItems.map((item, index) => (
          <AccordionItem key={item.id} value={`shop-${index}`}>
            <AccordionTrigger className="flex justify-start gap-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {item.title || `Store ${index + 1}`}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mb-4 p-4 bg-gray-700">
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`store-title-${index}`}>Store Title</Label>
                    <Input
                      id={`store-title-${index}`}
                      value={item.title}
                      onChange={(e) => onShopItemChange(index, 'title', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., My Etsy Shop"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`store-url-${index}`}>Store URL</Label>
                    <Input
                      id={`store-url-${index}`}
                      value={item.storeUrl}
                      onChange={(e) => onShopItemChange(index, 'storeUrl', e.target.value)}
                      className="mt-1"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Supports Shopify, Etsy, Gumroad, and BigCartel stores
                    </p>
                  </div>

                  <div>
                    <Label htmlFor={`store-image-${index}`}>Store Image</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      {item.image && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                          <Image 
                            src={item.image} 
                            alt={item.title || 'Store image'} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                      )}
                      <ImageUpload 
                        onImageUploaded={(file) => {
                          onImageChange(index, file)
                        }}
                      />
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => onRemoveShopItem(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove Store
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button type="button" onClick={onAddShopItem} className="mt-2">
        <Plus className="w-4 h-4 mr-2" /> Add Store
      </Button>
    </div>
  )
} 