'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ProfileData, MediaItemType, SpotlightItemType, ShopItemType } from './UserProfileContainer';
import ImageUpload from '@/components/ui/ImageUpload';
import { Upload, Plus, Trash2, Check, Square, Link } from 'lucide-react';
import { validateSocialUrl } from '@/lib/validation';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  detectMediaType, 
  transformYouTubeUrl, 
  transformSoundCloudUrl, 
  transformSpotifyUrl, 
  transformAppleMusicUrl 
} from '@/lib/mediaUtils';

interface ProfileEditorProps {
  profile: ProfileData;
  mediaItems: MediaItemType[];
  spotlightItems: SpotlightItemType[];
  shopItems: ShopItemType[];
  onSave: (updatedProfile: Partial<ProfileData> | { spotlightItems: SpotlightItemType[] } | { mediaItems: MediaItemType[] }) => void;
  onPreviewToggle: () => void;
  onDoneEditing: () => void;
  isPreviewMode?: boolean;
}

// Social link platform options
const SOCIAL_PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'soundcloud', label: 'SoundCloud' },
  { value: 'linkedin', label: 'LinkedIn' }
];

interface SocialLinkError {
  platform: string;
  url: string;
}

// Add these styles at the top of the file, after imports
const mediaPreviewStyles = {
  container: "w-full max-w-xs mx-auto border border-gray-700 rounded overflow-hidden bg-gray-900/30",
  aspectRatio: {
    youtube: "pb-[56.25%]", // 16:9 aspect ratio
    soundcloud: "pb-[120px]", // Fixed height for SoundCloud
    spotify: "pb-[80px]", // Fixed height for Spotify track
    spotifyPlaylist: "pb-[280px]", // Fixed height for Spotify playlist
    appleMusic: "pb-[175px]", // Fixed height for Apple Music
    appleMusicPlaylist: "pb-[300px]" // Fixed height for Apple Music playlist
  }
};

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  mediaItems,
  spotlightItems,
  shopItems,
  onSave,
  onPreviewToggle,
  onDoneEditing,
  isPreviewMode = false,
}) => {
  // Local state for form values
  const [formValues, setFormValues] = useState<ProfileData>(profile);
  
  // Social link error state
  const [socialLinkErrors, setSocialLinkErrors] = useState<SocialLinkError[]>([]);
  
  // Spotlight errors state
  const [spotlightErrors, setSpotlightErrors] = useState<{[key: string]: {[key: string]: string}}>({});
  
  // Local spotlight items state (for editing before save)
  const [localSpotlightItems, setLocalSpotlightItems] = useState<SpotlightItemType[]>(spotlightItems);
  
  // Local media items state (for editing before save)
  const [localMediaItems, setLocalMediaItems] = useState<MediaItemType[]>(mediaItems);
  
  // Media error state
  const [mediaErrors, setMediaErrors] = useState<{[key: string]: string}>({});
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-save changes
    onSave({ [name]: value });
  };

  // Handle sticker toggle
  const handleStickerToggle = () => {
    const newStickerState = formValues.sticker?.visible !== true;
    const updatedSticker = {
      ...formValues.sticker || { image: '/images/stickers/daisy-blue.png', position: 'top-right' },
      visible: newStickerState
    };
    
    setFormValues(prev => ({
      ...prev,
      sticker: updatedSticker
    }));
    
    // Auto-save changes
    onSave({ sticker: updatedSticker });
  };
  
  // Handle sticker image selection
  const handleStickerChange = (stickerImage: string) => {
    const updatedSticker = {
      ...formValues.sticker || { position: 'top-right', visible: true },
      image: stickerImage
    };
    
    setFormValues(prev => ({
      ...prev,
      sticker: updatedSticker
    }));
    
    // Auto-save changes
    onSave({ sticker: updatedSticker });
  };
  
  // Handle image upload
  const handleImageUpload = (file: File) => {
    // Create a URL for the uploaded file
    const imageUrl = URL.createObjectURL(file);
    
    // Update local state
    setFormValues(prev => ({
      ...prev,
      image: imageUrl
    }));
    
    // Save the change to parent component
    onSave({ image: imageUrl });
  };
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };
  
  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  }, []);
  
  // Handle adding a new social link
  const handleAddSocialLink = () => {
    const updatedLinks = [
      ...formValues.socialLinks,
      { platform: '', url: '' }
    ];
    
    setFormValues(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
    
    // No need to auto-save yet since the new link is empty
    setSocialLinkErrors(prev => [...prev, { platform: '', url: '' }]);
  };
  
  // Handle removing a social link
  const handleRemoveSocialLink = (index: number) => {
    const updatedLinks = [...formValues.socialLinks];
    updatedLinks.splice(index, 1);
    
    setFormValues(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
    
    // Auto-save changes
    onSave({ socialLinks: updatedLinks });
    
    // Update errors array
    const updatedErrors = [...socialLinkErrors];
    updatedErrors.splice(index, 1);
    setSocialLinkErrors(updatedErrors);
  };
  
  // Handle changes to a social link field
  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = [...formValues.socialLinks];
    
    // Update the specific field
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    
    // If platform changed, clear URL to avoid validation errors
    if (field === 'platform') {
      updatedLinks[index].url = '';
      
      // Clear errors
      const updatedErrors = [...socialLinkErrors];
      updatedErrors[index] = { platform: '', url: '' };
      setSocialLinkErrors(updatedErrors);
    } else if (field === 'url') {
      // Validate URL
      const link = updatedLinks[index];
      if (link.platform) {
        const validation = validateSocialUrl(link.platform, value);
        
        // Update error state
        const updatedErrors = [...socialLinkErrors];
        updatedErrors[index] = { 
          ...updatedErrors[index] || { platform: '' }, 
          url: validation.message 
        };
        setSocialLinkErrors(updatedErrors);
        
        // Only update if URL is valid
        if (!validation.isValid) {
          return;
        }
      } else {
        // Platform not selected yet
        const updatedErrors = [...socialLinkErrors];
        updatedErrors[index] = { 
          platform: 'Please select a platform first', 
          url: '' 
        };
        setSocialLinkErrors(updatedErrors);
        return;
      }
    }
    
    setFormValues(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
    
    // Auto-save changes
    onSave({ socialLinks: updatedLinks });
  };
  
  // Handle spotlight item changes
  const handleSpotlightChange = (index: number, field: string, value: string) => {
    const updatedItems = [...localSpotlightItems];
    
    // Validate the field (simple validation)
    let errorMessage = '';
    if (field === 'title' && !value.trim()) {
      errorMessage = 'Title is required';
    } else if (field === 'title' && value.length > 80) {
      errorMessage = 'Title must be less than 80 characters';
    } else if (field === 'description' && !value.trim()) {
      errorMessage = 'Description is required';
    } else if (field === 'description' && value.length > 180) {
      errorMessage = 'Description must be less than 180 characters';
    } else if (field === 'link' && value.trim()) {
      try {
        new URL(value);
      } catch (e) {
        errorMessage = 'Please enter a valid URL';
      }
    }
    
    // Update errors state
    setSpotlightErrors(prev => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        [field]: errorMessage
      }
    }));
    
    // Only update if valid or for link field (which is optional)
    if (!errorMessage || field === 'link') {
      // Handle special case for link which is not in the type
      if (field === 'link') {
        (updatedItems[index] as any).link = value;
      } else {
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: value
        };
      }
      
      setLocalSpotlightItems(updatedItems);
      onSave({ spotlightItems: updatedItems });
    }
  };
  
  // Handle spotlight image change
  const handleSpotlightImageChange = (index: number, file: File) => {
    // Validate image
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setSpotlightErrors(prev => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          image: 'Please upload a valid image (JPEG, PNG, GIF, or WebP)'
        }
      }));
      return;
    }
    
    if (file.size > maxSize) {
      setSpotlightErrors(prev => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          image: 'Image must be less than 5MB'
        }
      }));
      return;
    }
    
    // Clear any previous errors
    setSpotlightErrors(prev => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        image: ''
      }
    }));
    
    // Create a URL for the uploaded file
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      
      const updatedItems = [...localSpotlightItems];
      updatedItems[index] = {
        ...updatedItems[index],
        image: imageUrl
      };
      
      setLocalSpotlightItems(updatedItems);
      onSave({ spotlightItems: updatedItems });
    };
    reader.readAsDataURL(file);
  };
  
  // Handle adding a new spotlight item
  const handleAddSpotlight = () => {
    const newItem: SpotlightItemType = {
      id: `spotlight-${Date.now()}`,
      title: '',
      description: '',
      image: ''
    };
    
    const updatedItems = [...localSpotlightItems, newItem];
    setLocalSpotlightItems(updatedItems);
    onSave({ spotlightItems: updatedItems });
  };
  
  // Handle removing a spotlight item
  const handleRemoveSpotlight = (index: number) => {
    const updatedItems = localSpotlightItems.filter((_, i) => i !== index);
    setLocalSpotlightItems(updatedItems);
    onSave({ spotlightItems: updatedItems });
    
    // Clean up errors for the removed item
    const updatedErrors = { ...spotlightErrors };
    delete updatedErrors[index];
    setSpotlightErrors(updatedErrors);
  };
  
  // Handle spotlight image upload via file input
  const handleSpotlightFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      handleSpotlightImageChange(index, e.target.files[0]);
    }
  };
  
  // Handle spotlight image drag and drop
  const handleSpotlightDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSpotlightImageChange(index, e.dataTransfer.files[0]);
    }
  };
  
  // Handle spotlight image drag over
  const handleSpotlightDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  // Custom spotlight item component
  const SpotlightItem = ({ item, index }: { item: SpotlightItemType & { link?: string }, index: number }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    return (
      <AccordionItem value={`spotlight-${index}`} className="border border-gray-700 rounded-md overflow-hidden">
        <AccordionTrigger className="px-4 py-3 bg-gray-800 hover:bg-gray-750 hover:no-underline">
          <div className="flex items-center gap-2 text-left">
            <span className="font-medium text-gray-200">
              {item.title || `Spotlight Item ${index + 1}`}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-gray-800/50">
          <div className="space-y-4">
            {/* Image upload area */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image
              </label>
              <div
                onDrop={(e) => handleSpotlightDrop(e, index)}
                onDragOver={handleSpotlightDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border border-dashed ${
                  spotlightErrors[index]?.image ? 'border-red-500' : 'border-gray-600'
                } rounded-lg p-4 flex flex-col items-center justify-center hover:border-gray-500 transition-colors`}
              >
                {item.image ? (
                  <div className="relative w-full aspect-video bg-gray-900 rounded overflow-hidden mb-4">
                    <Image
                      src={item.image}
                      alt={item.title || `Spotlight ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-300 mb-2">Drag & drop an image here, or click to select one</p>
                    <p className="text-gray-400 text-sm">Supports JPG, PNG, GIF, and WebP under 5MB</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => handleSpotlightFileChange(e, index)}
                />
                
                {spotlightErrors[index]?.image && (
                  <p className="text-sm text-red-500 mt-1">
                    {spotlightErrors[index].image}
                  </p>
                )}
              </div>
            </div>
            
            {/* Title field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleSpotlightChange(index, 'title', e.target.value)}
                className={`w-full p-3 bg-gray-900 border ${
                  spotlightErrors[index]?.title ? 'border-red-500' : 'border-gray-700'
                } rounded-md text-gray-100`}
                placeholder="Add a title"
              />
              {spotlightErrors[index]?.title && (
                <p className="text-sm text-red-500 mt-1">
                  {spotlightErrors[index].title}
                </p>
              )}
            </div>
            
            {/* Description field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={item.description}
                onChange={(e) => handleSpotlightChange(index, 'description', e.target.value)}
                className={`w-full p-3 bg-gray-900 border ${
                  spotlightErrors[index]?.description ? 'border-red-500' : 'border-gray-700'
                } rounded-md text-gray-100 resize-y`}
                rows={3}
                placeholder="Add a description"
              />
              {spotlightErrors[index]?.description && (
                <p className="text-sm text-red-500 mt-1">
                  {spotlightErrors[index].description}
                </p>
              )}
            </div>
            
            {/* Link field (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={(item as any).link || ''}
                  onChange={(e) => handleSpotlightChange(index, 'link', e.target.value)}
                  className={`w-full p-3 pl-10 bg-gray-900 border ${
                    spotlightErrors[index]?.link ? 'border-red-500' : 'border-gray-700'
                  } rounded-md text-gray-100`}
                  placeholder="https://..."
                />
              </div>
              {spotlightErrors[index]?.link && (
                <p className="text-sm text-red-500 mt-1">
                  {spotlightErrors[index].link}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Add a link to direct users to more information or resources
              </p>
            </div>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemoveSpotlight(index)}
              className="mt-2 inline-flex items-center px-4 py-2 rounded bg-red-900/30 border border-red-800 text-red-300 hover:bg-red-900/50 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Item
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  // Handle section visibility toggle
  const handleSectionVisibilityToggle = (section: 'spotlight' | 'media' | 'shop') => {
    const currentVisibility = formValues.sectionVisibility || {
      spotlight: true,
      media: true,
      shop: true
    };
    
    const updatedVisibility = {
      ...currentVisibility,
      [section]: !currentVisibility[section]
    };
    
    setFormValues(prev => ({
      ...prev,
      sectionVisibility: updatedVisibility
    }));
    
    // Auto-save changes
    onSave({ sectionVisibility: updatedVisibility });
  };
  
  // Custom Checkbox component
  const Checkbox = ({ checked, onChange, label, id }: { checked: boolean, onChange: () => void, label: string, id: string }) => {
    return (
      <div className="flex items-center space-x-2">
        <div 
          onClick={onChange}
          className={`w-5 h-5 flex items-center justify-center border ${checked ? 'bg-cyan-500 border-cyan-600' : 'border-gray-600 bg-gray-800'} rounded cursor-pointer`}
        >
          {checked && <Check className="w-4 h-4 text-white" />}
        </div>
        <label htmlFor={id} className="text-gray-300 cursor-pointer" onClick={onChange}>
          {label}
        </label>
      </div>
    );
  };

  // Define ProfileSection component within this file
  const ProfileSection = ({ 
    formValues, 
    handleInputChange, 
    fileInputRef, 
    handleDragOver, 
    handleDrop, 
    handleFileChange,
    handleAddSocialLink,
    handleRemoveSocialLink,
    handleSocialLinkChange,
    socialLinkErrors,
    SOCIAL_PLATFORMS
  }: { 
    formValues: ProfileData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAddSocialLink: () => void;
    handleRemoveSocialLink: (index: number) => void;
    handleSocialLinkChange: (index: number, field: 'platform' | 'url', value: string) => void;
    socialLinkErrors: SocialLinkError[];
    SOCIAL_PLATFORMS: {value: string, label: string}[];
  }) => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-cyan-300">Profile Details</h2>
        <div className="flex-grow border-t border-gray-700" />
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Welcome to your profile! This is where you can share who you are with the community.
        Add your name, title, and a profile image to get started.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Profile image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Profile Image
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center hover:border-gray-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {formValues.image && formValues.image !== '/images/placeholder.png' ? (
              <div className="w-20 h-20 overflow-hidden rounded-md mb-3">
                <img 
                  src={formValues.image} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
            )}
            
            <p className="text-gray-300 mb-2">Drag & drop an image here, or click to select one</p>
            <p className="text-gray-400 text-sm mb-4">Supports JPG, PNG, and GIFs under 5MB</p>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center px-4 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        {/* Name and title fields */}
        <div className="space-y-6">
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formValues.name}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-100"
              placeholder="Your name"
            />
          </div>
          
          {/* Title field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-100"
              placeholder="Producer, DJ, Sound Engineer, etc."
            />
          </div>
        </div>
      </div>
      
      {/* Bio field */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formValues.bio}
          onChange={handleInputChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-100 resize-y"
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>
      
      {/* Social Links */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-200 mb-3">Social Links</h3>
        <div className="space-y-4">
          {formValues.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-[180px]">
                <select
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-100"
                >
                  <option value="">Select platform</option>
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                {socialLinkErrors[index]?.platform && (
                  <p className="text-sm text-red-500 mt-1">
                    {socialLinkErrors[index].platform}
                  </p>
                )}
              </div>
              
              <div className="flex-grow">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className={`w-full p-3 bg-gray-900 border ${
                    socialLinkErrors[index]?.url ? 'border-red-500' : 'border-gray-700'
                  } rounded-md text-gray-100`}
                />
                {socialLinkErrors[index]?.url && (
                  <p className="text-sm text-red-500 mt-1">
                    {socialLinkErrors[index].url}
                  </p>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => handleRemoveSocialLink(index)}
                className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Remove social link"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="mt-3 inline-flex items-center px-4 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </button>
          
          {formValues.socialLinks.length === 0 && (
            <p className="text-gray-400 italic mt-2">
              Add your social media links to help people find you across platforms.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Handle media URL change
  const handleMediaURLChange = (index: number, url: string) => {
    if (!url.trim()) {
      setMediaErrors({
        ...mediaErrors,
        [index]: 'Please enter a valid URL'
      });
      return;
    }

    try {
      // Clean the URL
      const cleanUrl = url.trim();
      
      // Detect media type
      const mediaType = detectMediaType(cleanUrl);
      
      if (mediaType === 'unknown') {
        setMediaErrors({
          ...mediaErrors,
          [index]: 'Unsupported media URL. Please use YouTube, SoundCloud, Spotify, or Apple Music'
        });
        return;
      }
      
      // Transform the URL to an embeddable format
      let transformedUrl = cleanUrl;
      
      if (mediaType === 'youtube') {
        transformedUrl = transformYouTubeUrl(cleanUrl);
      } else if (mediaType.includes('soundcloud')) {
        transformedUrl = transformSoundCloudUrl(cleanUrl);
      } else if (mediaType.includes('spotify')) {
        transformedUrl = transformSpotifyUrl(cleanUrl);
      } else if (mediaType.includes('apple-music')) {
        transformedUrl = transformAppleMusicUrl(cleanUrl);
      }
      
      // Clear any previous errors
      const updatedErrors = { ...mediaErrors };
      delete updatedErrors[index];
      setMediaErrors(updatedErrors);
      
      // Update the media item
      const updatedItems = [...localMediaItems];
      updatedItems[index] = {
        ...updatedItems[index],
        type: mediaType,
        embedUrl: transformedUrl
      };
      
      setLocalMediaItems(updatedItems);
      onSave({ mediaItems: updatedItems });
      
    } catch (error) {
      setMediaErrors({
        ...mediaErrors,
        [index]: 'Invalid URL format'
      });
    }
  };
  
  // Handle adding a new media item
  const handleAddMedia = () => {
    const newItem: MediaItemType = {
      id: `media-${Date.now()}`,
      type: '',
      embedUrl: ''
    };
    
    const updatedItems = [...localMediaItems, newItem];
    setLocalMediaItems(updatedItems);
    onSave({ mediaItems: updatedItems });
  };
  
  // Handle removing a media item
  const handleRemoveMedia = (index: number) => {
    const updatedItems = localMediaItems.filter((_, i) => i !== index);
    setLocalMediaItems(updatedItems);
    onSave({ mediaItems: updatedItems });
    
    // Clean up errors for the removed item
    const updatedErrors = { ...mediaErrors };
    delete updatedErrors[index];
    setMediaErrors(updatedErrors);
  };
  
  // Complete rewrite of the title change handler to fix the input bug
  const handleMediaTitleChange = (index: number, title: string) => {
    // First, make a deep copy of the entire items array to ensure we're not modifying the original
    const updatedItems = JSON.parse(JSON.stringify(localMediaItems));
    
    // Explicitly set the title on the copied item at the specified index
    updatedItems[index].title = title;
    
    // Update local state with the completely new array
    setLocalMediaItems(updatedItems);
    
    // Then notify parent component with the completely new array
    onSave({ mediaItems: updatedItems });
  };
  
  // Get display name for media type
  const getMediaDisplayName = (type: string): string => {
    const typeMap: {[key: string]: string} = {
      'youtube': 'YouTube',
      'soundcloud': 'SoundCloud',
      'soundcloud-playlist': 'SoundCloud Playlist',
      'spotify': 'Spotify',
      'spotify-playlist': 'Spotify Playlist',
      'apple-music-album': 'Apple Music Album',
      'apple-music-playlist': 'Apple Music Playlist',
      'apple-music-station': 'Apple Music Station'
    };
    
    return typeMap[type] || 'Media';
  };
  
  // Create a more compact media preview component for the edit mode
  const MediaPreview = ({ item }: { item: MediaItemType }) => {
    if (!item.embedUrl) return null;
    
    // Determine the appropriate aspect ratio class based on media type
    const getAspectRatioClass = () => {
      if (item.type === 'youtube') {
        return mediaPreviewStyles.aspectRatio.youtube;
      } else if (item.type.includes('soundcloud')) {
        return item.type === 'soundcloud-playlist' 
          ? mediaPreviewStyles.aspectRatio.spotifyPlaylist // Use taller container for playlists
          : mediaPreviewStyles.aspectRatio.soundcloud;
      } else if (item.type.includes('spotify')) {
        return item.type === 'spotify-playlist' 
          ? mediaPreviewStyles.aspectRatio.spotifyPlaylist 
          : mediaPreviewStyles.aspectRatio.spotify;
      } else if (item.type.includes('apple-music')) {
        return item.type === 'apple-music-playlist' 
          ? mediaPreviewStyles.aspectRatio.appleMusicPlaylist 
          : mediaPreviewStyles.aspectRatio.appleMusic;
      }
      return mediaPreviewStyles.aspectRatio.youtube;
    };
    
    // YouTube embed
    if (item.type === 'youtube') {
      const videoId = item.embedUrl.includes('/embed/') 
        ? item.embedUrl.split('/embed/')[1]
        : item.embedUrl;
        
      return (
        <div className={mediaPreviewStyles.container}>
          <div className={`relative ${getAspectRatioClass()}`}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      );
    }
    
    // SoundCloud embed
    if (item.type.includes('soundcloud')) {
      return (
        <div className={mediaPreviewStyles.container}>
          <div className={`relative ${getAspectRatioClass()}`}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={item.embedUrl}
            ></iframe>
          </div>
        </div>
      );
    }
    
    // Spotify embed
    if (item.type.includes('spotify')) {
      return (
        <div className={mediaPreviewStyles.container}>
          <div className={`relative ${getAspectRatioClass()}`}>
            <iframe
              src={item.embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allowTransparency={true}
              allow="encrypted-media"
            ></iframe>
          </div>
        </div>
      );
    }
    
    // Apple Music embed
    if (item.type.includes('apple-music')) {
      return (
        <div className={mediaPreviewStyles.container}>
          <div className={`relative ${getAspectRatioClass()}`}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay *; encrypted-media *; fullscreen *"
              frameBorder="0"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={item.embedUrl}
            ></iframe>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 text-center bg-gray-800 border border-gray-700 rounded-md">
        <p>Unsupported media type: {item.type}</p>
      </div>
    );
  };
  
  // Media item component
  const MediaItem = ({ item, index }: { item: MediaItemType, index: number }) => {
    // Create local state for title that's decoupled from parent state
    const [localTitle, setLocalTitle] = useState(item.title || '');

    // Update local title on internal input changes
    const handleLocalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      console.log('Local title changing to:', newValue);
      setLocalTitle(newValue);
    };

    // Only update parent state when input loses focus
    const handleTitleBlur = () => {
      console.log('Updating parent with title:', localTitle);
      handleMediaTitleChange(index, localTitle);
    };

    // Update local state if parent state changes
    useEffect(() => {
      setLocalTitle(item.title || '');
    }, [item.title]);

    return (
      <AccordionItem value={`media-${index}`} className="border border-gray-700 rounded-md overflow-hidden">
        <AccordionTrigger className="px-4 py-3 bg-gray-800 hover:bg-gray-750 hover:no-underline">
          <div className="flex items-center gap-2 text-left">
            <span className="font-medium text-gray-200">
              {item.title || (item.type ? getMediaDisplayName(item.type) : `Media ${index + 1}`)}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-gray-800/50">
          <div className="space-y-4">
            {/* URL input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Media URL
              </label>
              <input
                type="text"
                value={item.embedUrl}
                onChange={(e) => handleMediaURLChange(index, e.target.value)}
                className={`w-full p-3 bg-gray-900 border ${
                  mediaErrors[index] ? 'border-red-500' : 'border-gray-700'
                } rounded-md text-gray-100`}
                placeholder="Paste URL from YouTube, SoundCloud, Spotify, or Apple Music"
              />
              {mediaErrors[index] && (
                <p className="text-sm text-red-500 mt-1">
                  {mediaErrors[index]}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Supports YouTube, SoundCloud, Spotify, and Apple Music links
              </p>
            </div>
            
            {/* Title field - using local state */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={localTitle}
                onChange={handleLocalTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTitleBlur();
                  }
                }}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-100"
                placeholder="Add a title for this media"
              />
            </div>
            
            {/* Media preview */}
            {item.embedUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preview
                </label>
                <MediaPreview item={item} />
              </div>
            )}
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemoveMedia(index)}
              className="mt-2 inline-flex items-center px-4 py-2 rounded bg-red-900/30 border border-red-800 text-red-300 hover:bg-red-900/50 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Media
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4 sm:p-8 md:p-12 lg:p-16">
        {/* Profile Edit Form - Updated to match screenshot */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <ProfileSection 
            formValues={formValues}
            handleInputChange={handleInputChange}
            fileInputRef={fileInputRef}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileChange={handleFileChange}
            handleAddSocialLink={handleAddSocialLink}
            handleRemoveSocialLink={handleRemoveSocialLink}
            handleSocialLinkChange={handleSocialLinkChange}
            socialLinkErrors={socialLinkErrors}
            SOCIAL_PLATFORMS={SOCIAL_PLATFORMS}
          />
        </div>
        
        {/* Section Visibility Controls */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Section Visibility</h2>
            <div className="flex-grow border-t border-gray-700" />
          </div>
          
          <p className="text-sm text-gray-400 mb-6">
            Choose which sections to display on your profile
          </p>
          
          <div className="space-y-4">
            <Checkbox 
              id="spotlight-visible" 
              checked={formValues.sectionVisibility?.spotlight !== false} 
              onChange={() => handleSectionVisibilityToggle('spotlight')}
              label="Show Spotlight section"
            />
            
            <Checkbox 
              id="media-visible" 
              checked={formValues.sectionVisibility?.media !== false} 
              onChange={() => handleSectionVisibilityToggle('media')}
              label="Show Media section"
            />
            
            <Checkbox 
              id="shop-visible" 
              checked={formValues.sectionVisibility?.shop !== false} 
              onChange={() => handleSectionVisibilityToggle('shop')}
              label="Show Shop section"
            />
          </div>
        </div>
        
        {/* Spotlight Section - Implemented with full functionality */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Spotlight</h2>
            <div className="flex-grow border-t border-gray-700" />
          </div>
          
          <p className="text-sm text-gray-400 mb-6">
            Share anything you want to highlight - your work, collaborations, friends' projects, or inspiring content. Supports all image formats including GIFs.
          </p>
          
          <div className="space-y-4">
            {localSpotlightItems.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-3">
                {localSpotlightItems.map((item, index) => (
                  <SpotlightItem 
                    key={item.id} 
                    item={item} 
                    index={index} 
                  />
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-400 mb-4">No spotlight items yet. Add your first one!</p>
              </div>
            )}
            
            <button
              type="button"
              onClick={handleAddSpotlight}
              className="mt-4 inline-flex items-center px-4 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Spotlight Item
            </button>
          </div>
        </div>
        
        {/* Media Section - Now below Spotlight */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Media</h2>
            <div className="flex-grow border-t border-gray-700" />
          </div>
          
          <p className="text-sm text-gray-400 mb-6">
            Share your music, videos, DJ mixes, and playlists from YouTube, SoundCloud, Spotify and Apple Music. Supports all formats.
          </p>
          
          <div className="space-y-4">
            {localMediaItems.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-3">
                {localMediaItems.map((item, index) => (
                  <MediaItem 
                    key={item.id} 
                    item={item} 
                    index={index} 
                  />
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-400 mb-4">No media items yet. Add your first one!</p>
              </div>
            )}
            
            <button
              type="button"
              onClick={handleAddMedia}
              className="mt-4 inline-flex items-center px-4 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </button>
          </div>
        </div>
        
        {/* Shop Section */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Shop</h2>
            <div className="flex-grow border-t border-gray-700" />
          </div>
          
          <p className="text-sm text-gray-400 mb-6">
            Sell your merch, music, or digital products directly from your profile.
          </p>
          
          <div className="border border-dashed border-gray-600 rounded-md p-8 text-center">
            <p className="text-gray-400">Shop editor will be implemented here</p>
          </div>
        </div>
        
        {/* Sticker selection - moved to bottom */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Profile Sticker</h2>
            <div className="flex-grow border-t border-gray-700" />
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">Add a decorative sticker to your profile</p>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">Show sticker</span>
                <div 
                  className={`w-10 h-6 rounded-full p-1 cursor-pointer ${
                    formValues.sticker?.visible ? 'bg-cyan-500' : 'bg-gray-700'
                  }`}
                  onClick={handleStickerToggle}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    formValues.sticker?.visible ? 'translate-x-4' : ''
                  }`}></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* Sticker options */}
              <div 
                className={`border-2 rounded-md p-2 cursor-pointer transition-all ${
                  formValues.sticker?.image === '/images/stickers/daisy-blue.png' 
                    ? 'border-cyan-500' 
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => handleStickerChange('/images/stickers/daisy-blue.png')}
              >
                <div className="aspect-square relative overflow-hidden rounded">
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-900/20">
                    <img 
                      src="/images/stickers/daisy-blue.png" 
                      alt="Blue Daisy Sticker" 
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
                <p className="text-xs text-center mt-1 text-gray-300">Blue Daisy</p>
              </div>
              
              <div 
                className={`border-2 rounded-md p-2 cursor-pointer transition-all ${
                  formValues.sticker?.image === '/images/stickers/daisy-pink.png' 
                    ? 'border-cyan-500' 
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => handleStickerChange('/images/stickers/daisy-pink.png')}
              >
                <div className="aspect-square relative overflow-hidden rounded">
                  <div className="absolute inset-0 flex items-center justify-center bg-pink-900/20">
                    <img 
                      src="/images/stickers/daisy-pink.png" 
                      alt="Pink Daisy Sticker" 
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
                <p className="text-xs text-center mt-1 text-gray-300">Pink Daisy</p>
              </div>
              
              <div 
                className={`border-2 rounded-md p-2 cursor-pointer transition-all ${
                  formValues.sticker?.image === '/images/stickers/daisy-yellow.png' 
                    ? 'border-cyan-500' 
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => handleStickerChange('/images/stickers/daisy-yellow.png')}
              >
                <div className="aspect-square relative overflow-hidden rounded">
                  <div className="absolute inset-0 flex items-center justify-center bg-yellow-900/20">
                    <img 
                      src="/images/stickers/daisy-yellow.png" 
                      alt="Yellow Daisy Sticker" 
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
                <p className="text-xs text-center mt-1 text-gray-300">Yellow Daisy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky footer for editor controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Changes save automatically
            </div>
            <button 
              onClick={onPreviewToggle}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md transition-colors"
            >
              {isPreviewMode ? 'Exit Preview' : 'Preview'}
            </button>
          </div>
          <button 
            onClick={onDoneEditing}
            className="px-6 py-2 text-lg border-2 border-cyan-300/60 hover:border-cyan-300/80 transition-colors rounded-md"
          >
            Done Editing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor; 