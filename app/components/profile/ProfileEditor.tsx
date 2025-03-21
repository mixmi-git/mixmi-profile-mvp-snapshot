'use client';

import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
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
import StickerSection from './editor/sections/StickerSection';

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

// Development-only logging utility
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

// Define a type for the form data ref
export interface ProfileEditorRefType {
  getCurrentFormData: () => {
    profile: ProfileData;
    spotlightItems: SpotlightItemType[];
    mediaItems: MediaItemType[];
    shopItems: ShopItemType[];
    hasEdited: boolean;
  };
}

const ProfileEditor = forwardRef<ProfileEditorRefType, ProfileEditorProps>(({
  profile,
  mediaItems,
  spotlightItems,
  shopItems,
  onSave,
  onPreview,
  onCancel,
  isPreviewMode
}, ref) => {
  // Form state
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [currentMediaItems, setCurrentMediaItems] = useState<MediaItemType[]>([...mediaItems]);
  const [currentSpotlightItems, setCurrentSpotlightItems] = useState<SpotlightItemType[]>([...spotlightItems]);
  const [currentShopItems, setCurrentShopItems] = useState<ShopItemType[]>([...shopItems]);
  
  // Debug logging
  useEffect(() => {
    console.log('🔄 ProfileEditor - Initial state loaded:', {
      profileName: profile.name,
      mediaCount: mediaItems.length,
      spotlightCount: spotlightItems.length,
      shopCount: shopItems.length,
    });
  }, [profile, mediaItems, spotlightItems, shopItems]);

  // Get the profile form data and hooks from useProfileForm
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

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    getCurrentFormData: () => ({
      profile: formProfile,
      spotlightItems: formSpotlightItems,
      mediaItems: formMediaItems,
      shopItems: formShopItems,
      hasEdited: true, // In a real implementation, you'd track edit state
    })
  }), [formProfile, formSpotlightItems, formMediaItems, formShopItems]);

  // Debug log on mount
  useEffect(() => {
    devLog('🎨 ProfileEditor mounted with:', {
      profile,
      mediaItems,
      spotlightItems,
      shopItems
    });
  }, [profile, mediaItems, spotlightItems, shopItems]);

  // Debug log form state after updates
  devLog('📝 Form state updated:', {
    spotlightItemsCount: formSpotlightItems?.length || 0,
    formDataFields: Object.keys(formProfile)
  });

  // Update form state when the user makes changes in the profile form
  const updateFormData = (newData: Partial<ProfileData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Update form data when media items change
  useEffect(() => {
    setCurrentMediaItems(formMediaItems);
  }, [formMediaItems]);

  // Update form data when spotlight items change
  useEffect(() => {
    setCurrentSpotlightItems(formSpotlightItems);
  }, [formSpotlightItems]);

  // Update form data when shop items change
  useEffect(() => {
    setCurrentShopItems(formShopItems);
  }, [formShopItems]);

  // Update form data when profile changes
  useEffect(() => {
    updateFormData({
      name: formProfile.name,
      title: formProfile.title,
      bio: formProfile.bio,
      image: formProfile.image,
      socialLinks: formProfile.socialLinks,
      sectionVisibility: formProfile.sectionVisibility,
      sticker: formProfile.sticker
    });
  }, [formProfile]);

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
      
      <StickerSection
        sticker={formProfile.sticker || {
          visible: true,
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png"
        }}
        onChange={(stickerData) => {
          updateProfile({
            ...formProfile,
            sticker: stickerData
          });
        }}
      />

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
});

export default ProfileEditor; 