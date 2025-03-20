import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  currentImage?: string;
  className?: string;
  aspectRatio?: 'square' | '16:9';
  showPreview?: boolean;
}

export default function ImageUpload({ 
  onUpload, 
  currentImage, 
  className,
  aspectRatio = 'square',
  showPreview = false
}: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      console.error('File must be an image');
      return;
    }

    // Check if it's a GIF and under 5MB, or any other image
    if ((file.type === 'image/gif' && file.size <= 5 * 1024 * 1024) || 
        (file.type !== 'image/gif' && file.type.startsWith('image/'))) {
      onUpload(file);
    } else if (file.type === 'image/gif' && file.size > 5 * 1024 * 1024) {
      console.error('GIF files must be under 5MB');
    }
  };

  const containerClasses = cn(
    "relative border-2 border-dashed rounded-lg cursor-pointer transition-colors",
    "bg-gray-800/50 border-gray-600 hover:border-gray-500",
    isDragActive && "border-cyan-500 bg-gray-800/70",
    aspectRatio === 'square' ? "aspect-square" : "aspect-video",
    className
  );

  const previewContainerClasses = cn(
    "relative rounded-lg overflow-hidden bg-gray-800/50",
    aspectRatio === 'square' ? "aspect-square" : "aspect-video",
    className
  );

  if (showPreview && currentImage) {
    return (
      <div className="space-y-4 relative z-10">
        <div className={previewContainerClasses}>
          <Image
            src={currentImage}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
        <div 
          className={containerClasses}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-400">
              Drag & drop an image here, or click to select one
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supports JPG, PNG, GIF, and WebP under 5MB
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={containerClasses}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
      />
      
      {currentImage ? (
        <div className="absolute inset-0">
          <Image
            src={currentImage}
            alt="Uploaded"
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="text-center p-6">
              <Upload className="mx-auto h-8 w-8 text-white mb-2" />
              <p className="text-sm text-white">
                Drop new image or click to replace
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-400">
            Drag & drop an image here, or click to select one
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supports JPG, PNG, GIF, and WebP under 5MB
          </p>
        </div>
      )}
    </div>
  );
} 