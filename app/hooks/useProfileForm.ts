import { useState, useEffect } from 'react';
import { ProfileData, MediaItemType, SpotlightItemType, ShopItemType } from '../components/profile/UserProfileContainer';
import { SocialLinkError } from '../components/profile/editor/types/EditorTypes';

export function useProfileForm(
  profile: ProfileData,
  initialSpotlightItems: SpotlightItemType[] = [],
  initialMediaItems: MediaItemType[] = [],
  initialShopItems: ShopItemType[] = []
) {
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItemType[]>(initialSpotlightItems);
  const [mediaItems, setMediaItems] = useState<MediaItemType[]>(
    initialMediaItems.length > 0 ? initialMediaItems : [{
      id: Date.now().toString(),
      type: '',
      title: ''
    }]
  );
  const [shopItems, setShopItems] = useState<ShopItemType[]>(initialShopItems);
  const [isDirty, setIsDirty] = useState(false);
  const [socialLinkErrors, setSocialLinkErrors] = useState<SocialLinkError[]>([]);

  // Debug logging for initialization
  useEffect(() => {
    console.log('🎵 useProfileForm initialized with:', {
      profile,
      spotlightItems: initialSpotlightItems?.length || 0,
      mediaItems: initialMediaItems?.length || 0,
      shopItems: initialShopItems?.length || 0,
      rawMediaItems: initialMediaItems
    });
  }, []);

  // Effect to update state when props change
  useEffect(() => {
    console.log('🎵 useProfileForm props updated:', {
      newMediaItems: initialMediaItems,
      currentMediaItems: mediaItems
    });
    
    setMediaItems(initialMediaItems.length > 0 ? initialMediaItems : [{
      id: Date.now().toString(),
      type: '',
      title: ''
    }]);
  }, [initialMediaItems]);

  const handleFieldChange = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const updateProfile = (updates: Partial<ProfileData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    setIsDirty(true);
  };

  const handleImageUpload = (file: File) => {
    // TODO: Implement actual file upload
    console.log('Uploading file:', file);
    setIsDirty(true);
  };

  // Spotlight handlers
  const handleSpotlightChange = (index: number, field: keyof SpotlightItemType, value: any) => {
    setSpotlightItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setIsDirty(true);
  };

  const handleSpotlightImageUpload = (index: number, file: File) => {
    // TODO: Implement actual file upload
    console.log('Uploading spotlight image:', file);
    setIsDirty(true);
  };

  const addSpotlightItem = () => {
    const newItem: SpotlightItemType = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      link: ''
    };
    setSpotlightItems((prev) => [...prev, newItem]);
    setIsDirty(true);
  };

  const removeSpotlightItem = (index: number) => {
    setSpotlightItems((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Media handlers
  const handleMediaChange = (index: number, field: keyof MediaItemType, value: any) => {
    console.log('🎵 Handling media change:', { index, field, value, currentItems: mediaItems });
    setMediaItems((prev) => {
      const updated = [...(prev || [])];
      if (!updated[index]) {
        updated[index] = {
          id: Date.now().toString(),
          type: '',
          title: ''
        };
      }
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setIsDirty(true);
  };

  const addMediaItem = () => {
    console.log('🎵 Adding new media item', { currentItems: mediaItems });
    const newItem: MediaItemType = {
      id: Date.now().toString(),
      type: '',
      title: ''
    };
    setMediaItems((prev) => [...(prev || []), newItem]);
    setIsDirty(true);
  };

  const removeMediaItem = (index: number) => {
    console.log('🎵 Removing media item:', { index, currentItems: mediaItems });
    setMediaItems((prev) => (prev || []).filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Shop handlers
  const handleShopChange = (index: number, field: keyof ShopItemType, value: any) => {
    setShopItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setIsDirty(true);
  };

  const handleShopImageUpload = (index: number, file: File) => {
    // TODO: Implement actual file upload
    console.log('Uploading shop item image:', file);
    setIsDirty(true);
  };

  const addShopItem = () => {
    const newItem: ShopItemType = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      price: '',
      link: ''
    };
    setShopItems((prev) => [...prev, newItem]);
    setIsDirty(true);
  };

  const removeShopItem = (index: number) => {
    setShopItems((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const saveAll = async () => {
    const updatedProfile = {
      ...formData,
      spotlightItems,
      mediaItems,
      shopItems
    };
    console.log('Saving all changes:', updatedProfile);
    setIsDirty(false);
    return updatedProfile;
  };

  return {
    formData,
    handleFieldChange,
    updateProfile,
    handleImageUpload,
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
    spotlightItems,
    mediaItems,
    shopItems
  };
}