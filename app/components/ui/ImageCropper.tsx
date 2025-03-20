'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import { Button } from '@/components/ui/button';

interface ImageCropperProps {
  image: string;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCrop, onCancel }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        onCrop(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative h-96">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button onClick={onCancel} variant="ghost">
          Cancel
        </Button>
        <Button onClick={handleCrop} variant="default">
          Crop & Save
        </Button>
      </div>
    </div>
  );
};

// Helper function to create a cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  return new Promise(async (resolve) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    // Set canvas size to the cropped size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Determine the original image format
    const imageType = imageSrc.startsWith('data:') 
      ? imageSrc.split(',')[0].split(':')[1].split(';')[0]
      : 'image/jpeg';

    // Convert directly to base64 data URL instead of blob URL
    const dataUrl = canvas.toDataURL(imageType, 0.95);
    resolve(dataUrl);
  });
}

export default ImageCropper; 