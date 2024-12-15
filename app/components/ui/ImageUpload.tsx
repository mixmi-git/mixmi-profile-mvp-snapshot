import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  aspectRatio?: number;
  maxSize?: number; // in bytes
  onImageUploaded: (file: File) => void;
  allowedTypes?: string[]; // e.g. ['image/jpeg', 'image/png']
  currentImage?: string; // Add this prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  maxSize = 5 * 1024 * 1024, // 5MB default
  onImageUploaded,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  currentImage
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (file) {
        console.log('Attempting to upload file:', {
          size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
          type: file.type,
          maxAllowedSize: `${maxSize / (1024 * 1024)}MB`
        });
        
        if (file.size > maxSize) {
          const error = new Error(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
          console.error('Size error:', error);
          throw error;
        }

        if (!allowedTypes.includes(file.type)) {
          const error = new Error(`File type ${file.type} is not supported. Supported types: ${allowedTypes.join(', ')}`);
          console.error('Type error:', error);
          throw error;
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        onImageUploaded(file);
      }
    } catch (error) {
      console.error('Error in onDrop:', error);
      throw error;
    }
  }, [maxSize, allowedTypes, onImageUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // Remove the accept and maxSize from here to handle in onDrop
    multiple: false,
    noClick: false,
    noKeyboard: false
  });

  const removeImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50/10' 
              : 'border-gray-600 hover:border-gray-500'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-400 text-center">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here, or click to select"}
            </p>
            <p className="text-xs text-gray-500">
              Supports JPG, PNG and GIF up to 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 rounded-lg object-contain"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 