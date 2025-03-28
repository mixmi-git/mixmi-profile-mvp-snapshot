import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface StickerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: {
    visible: boolean;
    image: string;
  };
  onSave: (sticker: { visible: boolean; image: string }) => void;
}

const STICKER_OPTIONS = [
  // Daisies
  {
    color: 'Blue',
    image: '/images/stickers/daisy-blue.png'
  },
  {
    color: 'Pink',
    image: '/images/stickers/daisy-pink.png'
  },
  {
    color: 'Purple',
    image: '/images/stickers/daisy-purple.png'
  },
  {
    color: 'White',
    image: '/images/stickers/daisy-white.png'
  },
  {
    color: 'Yellow',
    image: '/images/stickers/daisy-yellow.png'
  },
  // Mechanical
  {
    color: 'Moto',
    image: '/images/stickers/moto-wheel-2.png'
  },
  {
    color: 'Gear',
    image: '/images/stickers/gear-shiny.png'
  },
  // Fruit Slices
  {
    color: 'Lemon',
    image: '/images/stickers/lemon-slice.png'
  },
  {
    color: 'Lime',
    image: '/images/stickers/lime-slice.png'
  },
  {
    color: 'Orange',
    image: '/images/stickers/orange-slice.png'
  },
  {
    color: 'Pineapple',
    image: '/images/stickers/pineapple-slice.png'
  },
  {
    color: 'Strawberry',
    image: '/images/stickers/strawberry-slice.png'
  }
];

export function StickerEditorModal({
  isOpen,
  onClose,
  sticker,
  onSave,
}: StickerEditorModalProps) {
  const handleStickerChange = (newImage: string) => {
    onSave({ ...sticker, image: newImage });
  };

  const handleVisibilityChange = (visible: boolean) => {
    onSave({ ...sticker, visible });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-white">
            Edit Profile Sticker
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a daisy, fruit slice, or mechanical design for your profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Visibility Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sticker-visible" className="text-white">Show sticker</Label>
            <Switch
              id="sticker-visible"
              checked={sticker.visible}
              onCheckedChange={handleVisibilityChange}
              className="data-[state=checked]:bg-cyan-600"
            />
          </div>

          {/* Sticker Grid */}
          <div className="grid grid-cols-4 gap-3">
            {STICKER_OPTIONS.map((option) => (
              <button
                key={option.color}
                onClick={() => handleStickerChange(option.image)}
                className={`relative aspect-square rounded-lg p-2 transition-all ${
                  sticker.image === option.image
                    ? 'bg-cyan-950/50 ring-2 ring-cyan-500'
                    : 'bg-gray-800/50 hover:bg-gray-800'
                }`}
              >
                <div className="w-full h-full relative sticker-rotate">
                  <Image
                    src={option.image}
                    alt={`${option.color} daisy`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 