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

// All available sticker options with local paths
const STICKER_OPTIONS = [
  {
    value: "/images/stickers/daisy-blue.png",
    label: "Blue Daisy"
  },
  {
    value: "/images/stickers/daisy-purple.png",
    label: "Purple Daisy"
  },
  {
    value: "/images/stickers/daisy-white.png",
    label: "White Daisy"
  },
  {
    value: "/images/stickers/daisy-yellow.png",
    label: "Yellow Daisy"
  },
  {
    value: "/images/stickers/daisy-pink.png",
    label: "Pink Daisy"
  }
];

export default function StickerSection({
  sticker = { 
    visible: true, 
    image: "/images/stickers/daisy-blue.png"
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
              Add a decorative spinning flower to your profile
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
                  
                  <div className="w-24 h-24 relative mx-auto sticker-rotate">
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