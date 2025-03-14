'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ProfileData, MediaItemType, SpotlightItemType, ShopItemType } from './UserProfileContainer';
import ImageUpload from '@/components/ui/ImageUpload';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { validateSocialUrl } from '@/lib/validation';

interface ProfileEditorProps {
  profile: ProfileData;
  mediaItems: MediaItemType[];
  spotlightItems: SpotlightItemType[];
  shopItems: ShopItemType[];
  onSave: (updatedProfile: Partial<ProfileData>) => void;
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
  
  // Custom image display component
  const ImageDisplay = () => {
    if (formValues.image && formValues.image !== '/images/placeholder.png') {
      return (
        <div className="w-full relative border border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center hover:border-gray-500 transition-colors">
          <div className="w-20 h-20 overflow-hidden rounded-md mb-3">
            <img 
              src={formValues.image} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <p className="text-gray-300 mb-2">Drag & drop an image here, or click to select one</p>
          <p className="text-gray-400 text-sm mb-4">Supports JPG, PNG, and GIFs under 5MB</p>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </button>
        </div>
      );
    }
    
    return (
      <div 
        className="w-full border border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4 sm:p-8 md:p-12 lg:p-16">
        {/* Profile Edit Form - Updated to match screenshot */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Profile Details</h2>
            <div className="flex-grow border-t border-gray-700" />
          </div>
          
          <p className="text-sm text-gray-400 mb-8">
            Welcome to your creative space! This is your personal corner of the web where you can showcase your work, share your media, and connect with your audience. Think of it as your own customizable mini-site with built-in marketplace features. Make it uniquely yours.
          </p>
          
          <div className="space-y-8">
            {/* Profile Image - Improved implementation */}
            <div>
              <label className="block text-base font-medium text-gray-200 mb-2">
                Profile Image
              </label>
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="cursor-pointer"
              >
                <ImageDisplay />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-200 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-100"
                placeholder="Your Name"
              />
            </div>
            
            {/* Title field */}
            <div>
              <label htmlFor="title" className="block text-base font-medium text-gray-200 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-100"
                placeholder="Your Role / Title"
              />
              <p className="mt-1 text-xs text-gray-400">
                Your role or profession (e.g., "Music Producer" or "Digital Artist")
              </p>
            </div>
            
            {/* Bio field */}
            <div>
              <label htmlFor="bio" className="block text-base font-medium text-gray-200 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formValues.bio}
                onChange={handleInputChange}
                rows={5}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-100 resize-y"
                placeholder="Tell your story here..."
              />
            </div>
            
            {/* Social Links - implemented with proper functionality */}
            <div>
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
        </div>
        
        {/* Media Section - placeholder */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Media</h2>
            <div className="flex-grow border-t border-gray-700" />
          </div>
          <div className="border border-dashed border-gray-600 rounded-md p-8 text-center">
            <p className="text-gray-400">Media editor will be implemented here</p>
          </div>
        </div>
        
        {/* Spotlight Section - placeholder */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Spotlight</h2>
            <div className="flex-grow border-t border-gray-700" />
          </div>
          <div className="border border-dashed border-gray-600 rounded-md p-8 text-center">
            <p className="text-gray-400">Spotlight editor will be implemented here</p>
          </div>
        </div>
        
        {/* Shop Section - placeholder */}
        <div className="rounded-lg overflow-hidden bg-gray-800/50 mb-12 p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Shop</h2>
            <div className="flex-grow border-t border-gray-700" />
          </div>
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