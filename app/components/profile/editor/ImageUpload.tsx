import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageDataUrl: string) => void;
  aspectRatio?: 'square' | 'wide' | 'tall';
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  aspectRatio = 'square',
  className = '',
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a JPG, PNG, or GIF file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        onImageChange(base64data);
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error processing image');
      console.error('Error processing image:', err);
    }
  }, [onImageChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  }, [handleImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  }, [handleImageSelect]);

  return (
    <div className={`relative group ${className}`}>
      <div
        className={`relative rounded-md overflow-hidden bg-gray-800/50 border border-gray-700/50
          ${aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'wide' ? 'aspect-video' : 'aspect-[3/4]'}
          ${isHovering ? 'ring-2 ring-cyan-500 border-cyan-500/50' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovering(true);
        }}
        onDragLeave={() => {
          setIsHovering(false);
        }}
        onDrop={handleDrop}
      >
        {currentImage ? (
          <>
            <Image
              src={currentImage}
              alt="Upload preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
            
            {/* Upload overlay for existing image */}
            <label 
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileInput}
              />
              <Upload className="w-6 h-6 text-cyan-400 mb-2" />
              <span className="text-sm text-gray-300">Click to change image</span>
              <span className="text-xs text-gray-400 mt-1">or drag & drop here</span>
            </label>
          </>
        ) : (
          <label 
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileInput}
            />
            <Upload className="w-6 h-6 text-cyan-400 mb-2" />
            <span className="text-sm text-gray-300">Drag & drop an image here, or click to select one</span>
            <span className="text-xs text-gray-500 mt-1">Supports JPG, PNG, and GIFs under 5MB</span>
          </label>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}; 