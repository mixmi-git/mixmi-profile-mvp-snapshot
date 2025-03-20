'use client';

import React, { useEffect } from 'react';
import { ProfileData, ProfileEditorProps } from '../UserProfileContainer';
import { useProfileForm } from '../hooks/useProfileForm';
import ProfileDetailsSection from './sections/ProfileDetailsSection';
import SpotlightSection from './sections/SpotlightSection';
import MediaSection from './sections/MediaSection';
import ShopSection from './sections/ShopSection';
import { SpotlightSectionProps, MediaSectionProps, ShopSectionProps } from './types/EditorTypes';
import { Button } from '@/components/ui/button';
import { Eye, Save, X } from 'lucide-react';

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  spotlightItems,
  mediaItems,
  shopItems,
  onSave,
  onPreview,
  onCancel,
  isPreviewMode
}) => {
  const {
    formData,
    updateProfile,
    handleSpotlightChange,
    handleSpotlightImageUpload,
    handleMediaChange,
    handleShopChange,
    handleShopImageUpload,
    addSpotlightItem,
    removeSpotlightItem,
    addMediaItem,
    removeMediaItem,
    addShopItem,
    removeShopItem,
    isDirty,
    saveAll,
    socialLinkErrors,
    spotlightItems: formSpotlightItems,
    mediaItems: formMediaItems,
    shopItems: formShopItems,
  } = useProfileForm(profile, spotlightItems, mediaItems, shopItems);

  // Debug logging
  useEffect(() => {
    console.log('ProfileEditor mounted with props:', {
      profile,
      spotlightItemsCount: spotlightItems?.length || 0,
      mediaItemsCount: mediaItems?.length || 0,
      shopItemsCount: shopItems?.length || 0
    });
  }, []);

  const handleSaveAll = async () => {
    const updatedProfile = await saveAll();
    if (updatedProfile && onSave) {
      await onSave(updatedProfile);
    }
  };

  const handleSpotlightImageUploadWrapper = async (index: number, file: File) => {
    // TODO: Implement actual file upload
    console.log('Uploading spotlight image:', { index, file });
    handleSpotlightImageUpload(index, file);
  };

  const handleShopImageUploadWrapper = async (index: number, file: File) => {
    // TODO: Implement actual file upload
    console.log('Uploading shop image:', { index, file });
    handleShopImageUpload(index, file);
  };

  // Adapter function to match ProfileDetailsSection interface
  const handleProfileUpdate = (updates: Partial<ProfileData>) => {
    // If updates is a simple field-value pair, extract and update
    if (updates && Object.keys(updates).length === 1) {
      const field = Object.keys(updates)[0] as keyof ProfileData;
      const value = updates[field];
      updateProfile(field, value);
    } else {
      // For more complex updates (like arrays), we would need to handle differently
      // This is a placeholder for potential future implementation
      console.warn("Complex updates not fully implemented");
    }
  };

  return (
    <div className="dark w-full py-8">
      <div className="container mx-auto max-w-4xl px-4 space-y-8">
        {/* Profile Details */}
        <ProfileDetailsSection 
          profile={formData}
          updateProfile={handleProfileUpdate}
        />

        {/* Spotlight Section */}
        <SpotlightSection
          items={formSpotlightItems || []}
          onChange={handleSpotlightChange}
          onImageUpload={handleSpotlightImageUploadWrapper}
          onAdd={addSpotlightItem}
          onRemove={removeSpotlightItem}
        />

        {/* Media Section */}
        <MediaSection
          items={formMediaItems || []}
          onChange={handleMediaChange}
          onAdd={addMediaItem}
          onRemove={removeMediaItem}
        />

        {/* Shop Section */}
        <ShopSection
          items={formShopItems || []}
          onChange={handleShopChange}
          onImageUpload={handleShopImageUploadWrapper}
          onAdd={addShopItem}
          onRemove={removeShopItem}
        />
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-50">
        <div className="container mx-auto max-w-4xl px-4 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onPreview}
              className="text-gray-200"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>

            <Button
              onClick={handleSaveAll}
              disabled={!isDirty}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor; 