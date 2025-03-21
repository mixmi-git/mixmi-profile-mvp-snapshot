'use client'

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface StickerSectionProps {
  sticker?: {
    visible: boolean;
    image: string;
  };
  onChange: (sticker: { visible: boolean; image: string }) => void;
}

// All available sticker options
const STICKER_OPTIONS = [
  {
    value: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png",
    label: "Blue Daisy"
  },
  {
    value: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-purple-zuy0TjRXzDx6hnayJ249A4Mgp8ktLy.png",
    label: "Purple Daisy"
  },
  {
    value: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-white-sWezY97Qz4q7W6zenHPvu3ns9egGwH.png",
    label: "White Daisy"
  },
  {
    value: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-yellow-DLJp7QxgzvZ0jVQhO7iVmGDZ7QxTK9.png",
    label: "Yellow Daisy"
  },
  {
    value: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-pink-8c61sSM6GcN9gaqfZCUQ03j1ub4YGe.png",
    label: "Pink Daisy"
  }
];

export default function StickerSection({
  sticker = { 
    visible: true, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png" 
  },
  onChange
}: StickerSectionProps) {
  // Handle checkbox change
  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ 
      visible: e.target.checked, 
      image: sticker.image 
    });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ 
      visible: sticker.visible, 
      image: e.target.value 
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Profile Sticker</h2>
            <p className="text-sm text-gray-400 mt-2">
              Add a decorative flower to your profile
            </p>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sticker-enabled"
                  checked={sticker.visible}
                  onChange={handleVisibilityChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="sticker-enabled" className="text-sm font-medium text-gray-200">
                  Show sticker on profile
                </label>
              </div>
              
              {sticker.visible && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Choose a flower color
                    </label>
                    <select
                      value={sticker.image}
                      onChange={handleImageChange}
                      className="bg-gray-800 text-white rounded-md w-full p-2 border border-gray-700"
                    >
                      {STICKER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-24 h-24 relative mx-auto">
                    <Image
                      src={sticker.image}
                      alt="Selected sticker preview"
                      width={96}
                      height={96}
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
  );
} 