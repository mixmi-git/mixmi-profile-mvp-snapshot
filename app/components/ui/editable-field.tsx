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
  fieldType?: 'name' | 'title' | 'bio' | 'other';
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
  fieldType = 'other',
}: EditableFieldProps) => {
  // Use internal state if external control is not provided
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  
  // Track edited value separately from original
  const [editedValue, setEditedValue] = useState(value);
  
  // Character count state
  const [charCount, setCharCount] = useState(value.length);
  
  // Determine maxLength based on fieldType if not explicitly provided
  const defaultMaxLength = 
    fieldType === 'name' ? 30 : 
    fieldType === 'title' ? 50 : 
    fieldType === 'bio' ? 300 : 
    undefined;
  
  const effectiveMaxLength = maxLength || defaultMaxLength;
  
  // Input ref for focusing when edit mode is enabled
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // Update edited value when the original value changes
  useEffect(() => {
    if (!isEditing) {
      setEditedValue(value);
      setCharCount(value.length);
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
    setCharCount(value.length);
    setInternalIsEditing(false);
    if (onEditToggle) {
      onEditToggle(false);
    }
    if (onCancel) {
      onCancel();
    }
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditedValue(newValue);
    setCharCount(newValue.length);
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
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full ${inputClassName}`}
            rows={rows}
            maxLength={effectiveMaxLength}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editedValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full ${inputClassName}`}
            maxLength={effectiveMaxLength}
            onKeyDown={handleKeyDown}
          />
        )}
        
        {effectiveMaxLength && (
          <div className="text-xs text-gray-400 mt-1 text-right">
            {charCount}/{effectiveMaxLength}
          </div>
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