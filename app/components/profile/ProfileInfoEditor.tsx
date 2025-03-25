'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { ProfileData } from '@/types';

interface ProfileInfoEditorProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSave: (updates: { name: string; title: string; bio: string }) => void;
}

export function ProfileInfoEditor({ isOpen, onClose, profile, onSave }: ProfileInfoEditorProps) {
  // Form state
  const [formValues, setFormValues] = useState({
    name: '',
    title: '',
    bio: ''
  });
  
  // Character counts
  const [charCounts, setCharCounts] = useState({
    name: 0,
    title: 0,
    bio: 0
  });
  
  // Max lengths
  const maxLengths = {
    name: 30,
    title: 50,
    bio: 300
  };
  
  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    title: '',
    bio: ''
  });
  
  // Initialize form values from profile
  useEffect(() => {
    if (isOpen) {
      setFormValues({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || ''
      });
      
      setCharCounts({
        name: (profile.name || '').length,
        title: (profile.title || '').length,
        bio: (profile.bio || '').length
      });
      
      // Clear errors
      setErrors({
        name: '',
        title: '',
        bio: ''
      });
    }
  }, [isOpen, profile]);
  
  // Handle input changes
  const handleChange = (field: 'name' | 'title' | 'bio', value: string) => {
    const newValue = value.slice(0, maxLengths[field]); // Enforce max length
    
    setFormValues(prev => ({
      ...prev,
      [field]: newValue
    }));
    
    setCharCounts(prev => ({
      ...prev,
      [field]: newValue.length
    }));
    
    // Clear error when field is being edited
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors = { ...errors };
    let isValid = true;
    
    // Name validation
    if (!formValues.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Title validation (optional but good to have)
    if (!formValues.title.trim()) {
      newErrors.title = 'Title is recommended';
      // Not setting isValid to false as title can be optional
    }
    
    // Bio validation (optional but good to have)
    if (!formValues.bio.trim()) {
      newErrors.bio = 'Bio is recommended';
      // Not setting isValid to false as bio can be optional
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name: formValues.name.trim(),
        title: formValues.title.trim(),
        bio: formValues.bio.trim()
      });
      onClose();
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile Information</DialogTitle>
          <DialogDescription>
            Update your profile information below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 overflow-y-auto max-h-[calc(70vh-100px)]">
          {/* Name Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                Name <span className="text-red-400">*</span>
              </Label>
              <span className="text-xs text-gray-400">
                {charCounts.name}/{maxLengths.name}
              </span>
            </div>
            <Input
              id="name"
              value={formValues.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Your name"
              maxLength={maxLengths.name}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Title Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                Title
              </Label>
              <span className="text-xs text-gray-400">
                {charCounts.title}/{maxLengths.title}
              </span>
            </div>
            <Input
              id="title"
              value={formValues.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Your title or role (e.g., Artist, Producer)"
              maxLength={maxLengths.title}
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1">{errors.title}</p>
            )}
          </div>
          
          {/* Bio Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
                Bio
              </Label>
              <span className="text-xs text-gray-400">
                {charCounts.bio}/{maxLengths.bio}
              </span>
            </div>
            <Textarea
              id="bio"
              value={formValues.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
              placeholder="Tell your story here..."
              maxLength={maxLengths.bio}
            />
            {errors.bio && (
              <p className="text-xs text-red-400 mt-1">{errors.bio}</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="text-gray-300 hover:text-gray-900">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 