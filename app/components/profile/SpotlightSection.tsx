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
import ErrorBoundary from '../ui/ErrorBoundary';

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
}

export function SpotlightSection({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onImageChange
}: SpotlightSectionProps) {
  const handleImageChange = async (index: number, file: File | null) => {
    if (!file) return
    
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB')
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const updatedItems = [...items]
        updatedItems[index] = {
          ...updatedItems[index],
          image: reader.result as string
        }
        onImageChange(index, file)
      }
      reader.onerror = () => {
        throw new Error('Failed to read image file')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error handling image:', error)
      // You can add error state handling here if needed
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold">Spotlight</h3>
        <p className="text-sm text-gray-400 mt-2">
          Share your work, collaborations, and featured content
        </p>
      </div>
      <Accordion type="single" collapsible>
        {items.map((item, index) => (
          <AccordionItem key={item.id} value={`spotlight-${index}`}>
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
                      onChange={(e) => onItemChange(index, 'title', e.target.value)}
                      className="mt-1"
                      placeholder="Enter title"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-description-${index}`}>Description</Label>
                    <Input
                      id={`item-description-${index}`}
                      value={item.description}
                      onChange={(e) => onItemChange(index, 'description', e.target.value)}
                      className="mt-1"
                      placeholder="Add a description"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-image-${index}`}>Image</Label>
                    <div className="mt-2">
                      <ErrorBoundary>
                        <ImageUpload 
                          onImageUploaded={(file) => {
                            handleImageChange(index, file)
                          }}
                          currentImage={item.image}
                        />
                      </ErrorBoundary>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`item-link-${index}`}>Link</Label>
                    <Input
                      id={`item-link-${index}`}
                      value={item.link}
                      onChange={(e) => onItemChange(index, 'link', e.target.value)}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>

                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => onRemoveItem(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove Item
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button type="button" onClick={onAddItem} className="mt-2">
        <Plus className="w-4 h-4 mr-2" /> Add Item
      </Button>
    </div>
  )
} 