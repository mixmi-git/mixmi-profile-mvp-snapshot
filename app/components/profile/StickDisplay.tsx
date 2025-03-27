'use client'

import Image from "next/image"

interface StickerDisplayProps {
  sticker?: {
    visible: boolean;
    image: string;
  };
  sectionVisibility?: {
    sticker?: boolean;
  };
}

export default function StickerDisplay({
  sticker = { 
    visible: true, 
    image: "/images/stickers/daisy-blue.png" 
  },
  sectionVisibility = { sticker: true }
}: StickerDisplayProps) {
  // If sticker is not visible or section is hidden, don't render anything
  if (!sticker.visible || sectionVisibility.sticker === false) {
    return null;
  }

  return (
    <div className="w-full flex justify-center mt-12">
      <div className="w-32 h-32 sticker-rotate [filter:drop-shadow(0_0_8px_rgba(180,180,255,0.3))]">
        <Image
          src={sticker.image}
          alt="Profile sticker"
          width={128}
          height={128}
          className="w-full h-full object-contain"
          priority
          unoptimized
        />
      </div>
    </div>
  );
} 