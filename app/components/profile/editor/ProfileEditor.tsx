'use client';

import React, { useEffect } from 'react';
import { ProfileData, ProfileEditorProps } from '../UserProfileContainer';
import { useProfileForm } from '@/hooks/useProfileForm';
import ProfileDetailsSection from './sections/ProfileDetailsSection';
import SpotlightSection from './sections/SpotlightSection';
import MediaSection from './sections/MediaSection';
import ShopSection from './sections/ShopSection';
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
    shopItems: formShopItems
  } = useProfileForm(profile, spotlightItems, mediaItems, shopItems);

  // Debug logging
  useEffect(() => {
    console.log('🎨 ProfileEditor mounted with props:', {
      profile,
      spotlightItems: spotlightItems?.length || 0,
      mediaItems: mediaItems?.length || 0,
      shopItems: shopItems?.length || 0,
      rawMediaItems: mediaItems,
      componentStack: new Error().stack
    });
  }, []);

  // Debug logging for media items changes
  useEffect(() => {
    console.log('🎨 ProfileEditor media items updated:', {
      mediaItemsLength: mediaItems?.length || 0,
      isArray: Array.isArray(mediaItems),
      rawMediaItems: mediaItems,
      formMediaItemsLength: formMediaItems?.length || 0,
      formMediaItemsIsArray: Array.isArray(formMediaItems),
      rawFormMediaItems: formMediaItems
    });
  }, [mediaItems, formMediaItems]);

  // Debug logging for form state
  useEffect(() => {
    console.log('🎵 Form state updated:', {
      formData,
      spotlightItems: formSpotlightItems?.length || 0,
      mediaItems: formMediaItems?.length || 0,
      shopItems: formShopItems?.length || 0,
      rawMediaItems: formMediaItems,
      componentStack: new Error().stack
    });
  }, [formData, formSpotlightItems, formMediaItems, formShopItems]);

  const handleSaveAll = async () => {
    const updatedProfile = await saveAll();
    if (onSave) {
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

  return (
    <div className="dark w-full py-8">
      <div className="container mx-auto max-w-4xl px-4 space-y-8">
        {/* Debug Banner */}
        <div className="bg-pink-500 text-white p-8 text-center font-bold text-xl border-4 border-white">
          <h2>DEBUG: ProfileEditor is rendering</h2>
          <div className="text-sm mt-2">
            <p>Spotlight Items: {formSpotlightItems?.length || 0}</p>
            <p>Media Items: {formMediaItems?.length || 0}</p>
            <p>Shop Items: {formShopItems?.length || 0}</p>
            <p>Media Items Array: {Array.isArray(formMediaItems) ? 'Yes' : 'No'}</p>
            <p>Media Section Should Render: Yes</p>
            <p>Component Stack: {new Error().stack}</p>
          </div>
        </div>

        {/* Profile Details */}
        <ProfileDetailsSection 
          profile={formData}
          updateProfile={updateProfile}
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
        <div className="bg-pink-500 text-white p-4 rounded-lg mb-4">
          <h3 className="font-bold">Media Section Container Debug</h3>
          <p>About to render MediaSection with {formMediaItems?.length || 0} items</p>
          <p>Items Array: {Array.isArray(formMediaItems) ? 'Yes' : 'No'}</p>
        </div>
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

        {/* Debug Section */}
        <div className="bg-pink-500 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-white mb-4">Debug Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-white text-lg">Media Items Debug</p>
              <pre className="text-sm text-white mt-2 overflow-auto max-h-40 p-4 bg-pink-600 rounded">
                {JSON.stringify({
                  mediaItemsLength: formMediaItems?.length || 0,
                  isArray: Array.isArray(formMediaItems),
                  rawMediaItems: formMediaItems
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
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