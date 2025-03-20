'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from 'react'

interface Sticker {
  visible: boolean;
  image: string;
}

interface StickerSectionProps {
  sticker?: Sticker;
  onStickerChange: (checked: boolean) => void;
  onImageChange: (value: string) => void;
  isEditing?: boolean;
}

export default function StickerSection({
  sticker = { visible: true, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png" },
  onStickerChange,
  onImageChange,
  isEditing = false
}: StickerSectionProps) {
  // Create a local state to avoid direct prop usage in the checkbox
  const [isVisible, setIsVisible] = useState(sticker?.visible ?? true);
  const [currentImage, setCurrentImage] = useState(sticker?.image || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png");
  
  // Update local state when props change
  useEffect(() => {
    setIsVisible(sticker?.visible ?? true);
    setCurrentImage(sticker?.image || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png");
  }, [sticker]);
  
  // Handle checkbox change locally first, then propagate to parent
  const handleCheckboxChange = (checked: boolean) => {
    setIsVisible(checked);
    onStickerChange(checked);
  };
  
  // Handle image change locally first, then propagate to parent
  const handleImageChange = (image: string) => {
    setCurrentImage(image);
    onImageChange(image);
  };

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold">Profile Sticker</h3>
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sticker-enabled"
                    checked={isVisible}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="sticker-enabled">Enable profile sticker</Label>
                </div>
                
                {isVisible && (
                  <div className="space-y-4">
                    <Select
                      value={currentImage}
                      onValueChange={handleImageChange}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a sticker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png">
                          <div className="flex items-center">
                            <div className="w-8 h-8 mr-2 relative">
                              <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png"
                                alt="Blue Daisy"
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            Blue Daisy
                          </div>
                        </SelectItem>
                        <SelectItem value="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-purple-zuy0TjRXzDx6hnayJ249A4Mgp8ktLy.png">
                          <div className="flex items-center">
                            <div className="w-8 h-8 mr-2 relative">
                              <Image 
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-purple-zuy0TjRXzDx6hnayJ249A4Mgp8ktLy.png" 
                                alt="Purple Daisy" 
                                fill 
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            Purple Daisy
                          </div>
                        </SelectItem>
                        <SelectItem value="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-white-sWezY97Qz4q7W6zenHPvu3ns9egGwH.png">
                          <div className="flex items-center">
                            <div className="w-8 h-8 mr-2 relative">
                              <Image 
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-white-sWezY97Qz4q7W6zenHPvu3ns9egGwH.png" 
                                alt="White Daisy" 
                                fill 
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            White Daisy
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="w-20 h-20 relative mx-auto sticker-rotate">
                      <Image
                        src={currentImage}
                        alt="Selected sticker preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Display mode
  if (!isVisible) {
    return (
      <div className="p-4 border border-gray-700 rounded-lg">
        <p className="text-center text-gray-400">Sticker is disabled</p>
      </div>
    ); 
  }

  return (
    <div className="relative w-[200px] h-[200px] mx-auto mt-auto pt-8 pb-16 border border-gray-700 rounded-lg">
      <div className="sticker-rotate">
        <Image
          src={currentImage}
          alt="Profile sticker"
          width={200}
          height={200}
          className="w-auto h-auto"
          priority
          unoptimized
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 text-xs text-center text-gray-400 p-1 bg-black/50">
        Sticker is visible (Display Mode)
      </div>
    </div>
  )
} 