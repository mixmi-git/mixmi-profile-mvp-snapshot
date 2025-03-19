'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProfileData } from '../types/EditorTypes';
import ImageUpload from '@/components/ui/ImageUpload';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Link, Plus, Trash2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProfileDetailsProps {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
}

interface FormErrors {
  name?: string;
  title?: string;
  bio?: string;
  image?: string;
  socialLinks?: { platform?: string, url?: string }[];
}

const ProfileDetailsSection: React.FC<ProfileDetailsProps> = ({
  profile = { name: '', title: '', bio: '', socialLinks: [] },
  updateProfile
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Ensure socialLinks is always an array
  const socialLinks = Array.isArray(profile.socialLinks) ? profile.socialLinks : [];

  // Debug logging
  useEffect(() => {
    console.log('👤 ProfileDetailsSection mounted with:', {
      profile,
      socialLinksCount: socialLinks.length,
      componentStack: new Error().stack
    });
  }, [profile]);

  // Validation functions
  const validateField = (field: keyof ProfileData, value: string): { isValid: boolean, message: string } => {
    switch(field) {
      case 'name':
        if (!value.trim()) return { isValid: false, message: 'Name is required' };
        if (value.length > 50) return { isValid: false, message: 'Name must be less than 50 characters' };
        return { isValid: true, message: '' };
      case 'title':
        if (!value.trim()) return { isValid: false, message: 'Title is required' };
        if (value.length > 100) return { isValid: false, message: 'Title must be less than 100 characters' };
        return { isValid: true, message: '' };
      case 'bio':
        if (!value.trim()) return { isValid: false, message: 'Bio is required' };
        if (value.length > 500) return { isValid: false, message: 'Bio must be less than 500 characters' };
        return { isValid: true, message: '' };
      default:
        return { isValid: true, message: '' };
    }
  };

  const validateSocialLink = (platform: string, url: string): { isValid: boolean, message: string } => {
    if (!url.trim()) return { isValid: true, message: '' }; // Empty URLs are allowed
    if (!url.match(/^https?:\/\/.+/)) {
      return { isValid: false, message: 'URL must start with http:// or https://' };
    }
    return { isValid: true, message: '' };
  };

  // Update handlers with validation
  const handleProfileUpdate = useCallback((field: keyof ProfileData, value: string) => {
    const validation = validateField(field, value);
    
    setErrors(prev => ({
      ...prev,
      [field]: validation.isValid ? undefined : validation.message
    }));
    
    if (validation.isValid) {
      updateProfile({ [field]: value });
    }
  }, [updateProfile]);

  const addSocialLink = useCallback(() => {
    const newLinks = [...socialLinks, { platform: '', url: '' }];
    updateProfile({ socialLinks: newLinks });
  }, [socialLinks, updateProfile]);

  const removeSocialLink = useCallback((index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    updateProfile({ socialLinks: newLinks });
    
    // Remove errors for this index
    setErrors(prev => {
      const newSocialErrors = [...(prev.socialLinks || [])];
      newSocialErrors.splice(index, 1);
      return {
        ...prev,
        socialLinks: newSocialErrors
      };
    });
  }, [socialLinks, updateProfile]);

  const updateSocialLink = useCallback((index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    
    // Validate URL if applicable
    if (field === 'url') {
      const validation = validateSocialLink(newLinks[index].platform, value);
      
      setErrors(prev => {
        const newSocialErrors = [...(prev.socialLinks || [])];
        newSocialErrors[index] = {
          ...(newSocialErrors[index] || {}),
          url: validation.isValid ? undefined : validation.message
        };
        return {
          ...prev,
          socialLinks: newSocialErrors
        };
      });
      
      if (!validation.isValid) return;
    }
    
    updateProfile({ socialLinks: newLinks });
  }, [socialLinks, updateProfile]);

  const handleImageUpload = useCallback((file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        image: 'Image size must be less than 5MB'
      }));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateProfile({ image: e.target.result as string });
        
        // Clear any previous error
        setErrors(prev => ({
          ...prev,
          image: undefined
        }));
      }
    };
    reader.readAsDataURL(file);
  }, [updateProfile]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Profile Details</h2>
            <p className="text-sm text-gray-400 mt-2">
              These details will be displayed on your public profile page.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="flex flex-col items-center">
            <ImageUpload
              currentImage={profile.image}
              onUpload={handleImageUpload}
              className="w-32 h-32 rounded-full"
            />
            <p className="text-xs text-gray-400 mt-2">
              Profile image (recommended: square, 500x500px)
            </p>
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={profile.name}
                onChange={(e) => handleProfileUpdate('name', e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={profile.title}
                onChange={(e) => handleProfileUpdate('title', e.target.value)}
                className={errors.title ? "border-red-500" : ""}
                placeholder="Your title or role (e.g., Artist, Producer, DJ)"
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea
                value={profile.bio}
                onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-800 border ${errors.bio ? 'border-red-500' : 'border-gray-700'} rounded-md text-white`}
                rows={4}
                placeholder="Tell the world about yourself"
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-400">
                  {profile.bio ? profile.bio.length : 0}/500 characters
                </p>
                {errors.bio && (
                  <p className="text-xs text-red-500">{errors.bio}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Social Links</Label>
                <Button onClick={addSocialLink} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>

              {socialLinks.length === 0 ? (
                <div className="text-center py-4 bg-gray-800/30 rounded-md">
                  <p className="text-sm text-gray-400">
                    No social links yet. Add one to connect with your audience.
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {socialLinks.map((link, index) => (
                    <AccordionItem key={index} value={`link-${index}`}>
                      <AccordionTrigger className="hover:no-underline text-left">
                        <div className="flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          <span>{link.platform || 'New Link'}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label>Platform</Label>
                            <Input
                              value={link.platform}
                              onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                              placeholder="e.g. Twitter, Instagram, YouTube"
                            />
                          </div>
                          <div>
                            <Label>URL</Label>
                            <Input
                              value={link.url}
                              onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                              className={errors.socialLinks?.[index]?.url ? "border-red-500" : ""}
                              placeholder="https://"
                            />
                            {errors.socialLinks?.[index]?.url && (
                              <p className="text-xs text-red-500 mt-1">{errors.socialLinks[index].url}</p>
                            )}
                          </div>
                          <Button
                            onClick={() => removeSocialLink(index)}
                            variant="destructive"
                            size="sm"
                            className="w-full mt-2"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Link
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetailsSection;