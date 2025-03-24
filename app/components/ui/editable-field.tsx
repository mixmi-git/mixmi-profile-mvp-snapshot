'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Button } from './button';
import { Check, X, Edit2 } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  onEditToggle?: (isEditing: boolean) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  controlsClassName?: string;
  showControls?: boolean;
  maxLength?: number;
  isAuthenticated?: boolean;
  hideEditButton?: boolean;
}

/**
 * EditableField component that switches between a read-only view and an editable input field
 */
const EditableField = ({
  value,
  onSave,
  onCancel,
  isEditing: externalIsEditing,
  onEditToggle,
  placeholder = 'Enter value...',
  multiline = false,
  rows = 3,
  className = '',
  labelClassName = '',
  inputClassName = '',
  controlsClassName = '',
  showControls = true,
  maxLength,
  isAuthenticated = true,
  hideEditButton = false,
}: EditableFieldProps) => {
  // Use internal state if external control is not provided
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  
  // Track edited value separately from original
  const [editedValue, setEditedValue] = useState(value);
  
  // Input ref for focusing when edit mode is enabled
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // Update edited value when the original value changes
  useEffect(() => {
    if (!isEditing) {
      setEditedValue(value);
    }
  }, [value, isEditing]);
  
  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Delay focus slightly for better UX especially when transitioning
      setTimeout(() => {
        inputRef.current?.focus();
        // Place cursor at the end of text
        if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 50);
    }
  }, [isEditing]);
  
  // Enable editing mode
  const handleEdit = () => {
    if (!isAuthenticated) return;
    
    setInternalIsEditing(true);
    if (onEditToggle) {
      onEditToggle(true);
    }
  };
  
  // Save edited value
  const handleSave = () => {
    onSave(editedValue);
    setInternalIsEditing(false);
    if (onEditToggle) {
      onEditToggle(false);
    }
  };
  
  // Cancel editing and revert to original value
  const handleCancel = () => {
    setEditedValue(value);
    setInternalIsEditing(false);
    if (onEditToggle) {
      onEditToggle(false);
    }
    if (onCancel) {
      onCancel();
    }
  };
  
  // Handle Enter key to save and Escape to cancel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };
  
  // Edit mode - render input field
  if (isEditing) {
    return (
      <div className={`relative ${className}`}>
        {multiline ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${inputClassName}`}
            rows={rows}
            maxLength={maxLength}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${inputClassName}`}
            maxLength={maxLength}
            onKeyDown={handleKeyDown}
          />
        )}
        
        {showControls && (
          <div className={`flex items-center gap-2 mt-2 ${controlsClassName}`}>
            <Button size="sm" variant="outline" onClick={handleSave}>
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  // View mode - render text with optional edit button
  return (
    <div 
      className={`group relative ${className} ${isAuthenticated ? 'hover:bg-gray-100/5 dark:hover:bg-gray-800/20 rounded' : ''}`}
    >
      <div className={labelClassName || 'py-1'}>
        {value || <span className="text-gray-400">{placeholder}</span>}
      </div>
      
      {isAuthenticated && !hideEditButton && (
        <button
          onClick={handleEdit}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800/70 hover:bg-gray-700 text-white p-1 rounded-full"
          aria-label="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export { EditableField }; 