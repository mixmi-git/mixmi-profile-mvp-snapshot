'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Sticker } from "@/types/content"

interface StickerSectionProps {
  sticker: Sticker;
  onStickerChange: (checked: boolean) => void;
  onImageChange: (value: string) => void;
  isEditing?: boolean;
}

export function StickerSection({
  sticker,
  onStickerChange,
  onImageChange,
  isEditing = false
}: StickerSectionProps) {
  if (isEditing) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold">Profile Sticker</h3>
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sticker-enabled"
                checked={sticker.enabled}
                onCheckedChange={onStickerChange}
              />
              <Label htmlFor="sticker-enabled">Enable profile sticker</Label>
            </div>
            {sticker.enabled && (
              <div className="space-y-4">
                <Select
                  value={sticker.image}
                  onValueChange={onImageChange}
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
                            alt="Yellow Daisy" 
                            fill 
                            className="object-contain" 
                          />
                        </div>
                        Yellow Daisy
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
                          />
                        </div>
                        White Daisy
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="w-20 h-20 relative mx-auto sticker-rotate">
                  <Image
                    src={sticker.image}
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
    )
  }

  // Display mode
  if (!sticker.enabled) return null

  return (
    <div className="relative w-[200px] h-[200px] mx-auto mt-auto pt-8 pb-16">
      <div className="sticker-rotate">
        <Image
          src={sticker.image}
          alt="Profile sticker"
          width={200}
          height={200}
          className="w-auto h-auto"
          priority
        />
      </div>
    </div>
  )
} 