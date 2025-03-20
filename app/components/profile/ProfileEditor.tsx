'use client';

import React, { useEffect } from 'react';
import { ProfileData, MediaItemType, SpotlightItemType, ShopItemType } from './UserProfileContainer';
import { useProfileForm } from './editor/hooks/useProfileForm';
import ProfileDetailsSection from './editor/sections/ProfileDetailsSection';
import SpotlightSection from './editor/sections/SpotlightSection';
import MediaSection from './editor/sections/MediaSection';
import ShopSection from './editor/sections/ShopSection';
import VisibilitySection from './editor/sections/VisibilitySection';
import ImageCropper from '@/components/ui/ImageCropper';
import { Button } from "@/components/ui/button";
import { Save, Eye, X } from 'lucide-react';

interface ProfileEditorProps {
  profile: ProfileData;
  mediaItems: MediaItemType[];
  spotlightItems: SpotlightItemType[];
  shopItems: ShopItemType[];
  onSave: (updatedProfile: ProfileData) => void;
  onPreview: () => void;
  onCancel: () => void;
  isPreviewMode: boolean;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  mediaItems,
  spotlightItems,
  shopItems,
  onSave,
  onPreview,
  onCancel,
  isPreviewMode,
}) => {
  // Debug logging
  useEffect(() => {
    console.log('🎨 ProfileEditor mounted with:', {
      profile,
      mediaItems,
      spotlightItems,
      shopItems
    });
  }, [profile, mediaItems, spotlightItems, shopItems]);

  const {
    formProfile,
    formMediaItems,
    formSpotlightItems,
    formShopItems,
    updateProfile,
    updateMediaItems,
    updateSpotlightItems,
    updateShopItems,
    handleSubmit,
  } = useProfileForm({
    profile,
    mediaItems,
    spotlightItems,
    shopItems,
    onSave,
  });

  // Debug logging for form state
  useEffect(() => {
    console.log('📝 Form state updated:', {
      spotlightItemsCount: formSpotlightItems?.length || 0,
      formDataFields: Object.keys(formProfile)
    });
  }, [formProfile, formSpotlightItems]);

  return (
    <div className="space-y-8 pb-8">
      <ProfileDetailsSection
        profile={formProfile}
        updateProfile={updateProfile}
      />
      
      <SpotlightSection
        items={formSpotlightItems || []}
        onAdd={() => {
          const newItem = { id: Date.now().toString(), title: '', description: '', image: '', link: '' };
          updateSpotlightItems([...formSpotlightItems, newItem]);
        }}
        onChange={(index, field, value) => {
          const updatedItems = [...formSpotlightItems];
          updatedItems[index] = { ...updatedItems[index], [field]: value };
          updateSpotlightItems(updatedItems);
        }}
        onRemove={(index) => {
          updateSpotlightItems(formSpotlightItems.filter((_, i) => i !== index));
        }}
        onImageUpload={(index, file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const updatedItems = [...formSpotlightItems];
              updatedItems[index] = { ...updatedItems[index], image: e.target.result as string };
              updateSpotlightItems(updatedItems);
            }
          };
          reader.readAsDataURL(file);
        }}
      />

      <MediaSection
        items={formMediaItems || []}
        onAdd={() => {
          const newItem = { id: Date.now().toString(), type: 'youtube', title: '', rawUrl: '' };
          updateMediaItems([...formMediaItems, newItem]);
        }}
        onChange={(index, field, value) => {
          const updatedItems = [...formMediaItems];
          updatedItems[index] = { ...updatedItems[index], [field]: value };
          updateMediaItems(updatedItems);
        }}
        onRemove={(index) => {
          updateMediaItems(formMediaItems.filter((_, i) => i !== index));
        }}
      />

      <ShopSection
        items={formShopItems || []}
        onAdd={() => {
          const newItem = { id: Date.now().toString(), title: '', description: '', price: '', link: '', image: '' };
          updateShopItems([...formShopItems, newItem]);
        }}
        onChange={(index, field, value) => {
          const updatedItems = [...formShopItems];
          updatedItems[index] = { ...updatedItems[index], [field]: value };
          updateShopItems(updatedItems);
        }}
        onRemove={(index) => {
          updateShopItems(formShopItems.filter((_, i) => i !== index));
        }}
        onImageUpload={(index, file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const updatedItems = [...formShopItems];
              updatedItems[index] = { ...updatedItems[index], image: e.target.result as string };
              updateShopItems(updatedItems);
            }
          };
          reader.readAsDataURL(file);
        }}
      />

      <div className="mt-8 mb-4">
        <VisibilitySection
          sectionVisibility={formProfile.sectionVisibility || {}}
          updateVisibility={(visibility) => {
            updateProfile({
              ...formProfile,
              sectionVisibility: visibility
            });
          }}
        />
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button variant="outline" onClick={onPreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditor; 