import { useState, useCallback, useEffect } from 'react';
import { ProfileData, SpotlightItemType, MediaItemType, ShopItemType } from '../UserProfileContainer';
import { validateSocialUrl } from '@/lib/validation';

export const useProfileForm = (
  initialProfile: ProfileData,
  initialSpotlightItems: SpotlightItemType[],
  initialMediaItems: MediaItemType[],
  initialShopItems: ShopItemType[]
) => {
  // Log initialization once
  useEffect(() => {
    console.log('useProfileForm initialized', {
      profileName: initialProfile?.name,
      spotlightCount: initialSpotlightItems?.length || 0,
      mediaCount: initialMediaItems?.length || 0,
      shopCount: initialShopItems?.length || 0
    });
  }, []);

  // Form state
  const [formData, setFormData] = useState<ProfileData>(initialProfile);
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItemType[]>(initialSpotlightItems || []);
  const [mediaItems, setMediaItems] = useState<MediaItemType[]>(initialMediaItems || []);
  const [shopItems, setShopItems] = useState<ShopItemType[]>(initialShopItems || []);
  const [isDirty, setIsDirty] = useState(false);
  const [socialLinkErrors, setSocialLinkErrors] = useState<Array<{ platform: string; url: string }>>([]);

  // Profile field changes
  const updateProfile = useCallback((field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  // Profile image upload
  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // Spotlight item changes
  const handleSpotlightChange = useCallback((index: number, field: keyof SpotlightItemType, value: any) => {
    setSpotlightItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
    setIsDirty(true);
  }, []);

  // Spotlight image upload
  const handleSpotlightImageUpload = useCallback((index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSpotlightItems(prev => prev.map((item, i) => 
        i === index ? { ...item, image: reader.result as string } : item
      ));
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // Media item changes
  const handleMediaChange = useCallback((index: number, field: keyof MediaItemType, value: any) => {
    setMediaItems(prev => {
      // Make sure we're working with an array
      const currentItems = Array.isArray(prev) ? prev : [];
      
      // Update the item at the specified index
      return currentItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      );
    });
    setIsDirty(true);
  }, []);

  // Shop item changes
  const handleShopChange = useCallback((index: number, field: keyof ShopItemType, value: any) => {
    setShopItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
    setIsDirty(true);
  }, []);

  // Shop image upload
  const handleShopImageUpload = useCallback((index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setShopItems(prev => prev.map((item, i) => 
        i === index ? { ...item, image: reader.result as string } : item
      ));
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // Sticker changes
  const handleStickerEnabledChange = useCallback((visible: boolean) => {
    setFormData(prev => {
      // Ensure sticker exists with proper defaults
      const currentSticker = prev.sticker || { visible: false, image: '' };
      
      return {
        ...prev,
        sticker: {
          ...currentSticker,
          visible
        }
      };
    });
    setIsDirty(true);
  }, []);

  const handleStickerImageChange = useCallback((image: string) => {
    setFormData(prev => {
      // Ensure sticker exists with proper defaults
      const currentSticker = prev.sticker || { visible: false, image: '' };
      
      return {
        ...prev,
        sticker: {
          ...currentSticker,
          image
        }
      };
    });
    setIsDirty(true);
  }, []);

  // Add new items
  const addSpotlightItem = useCallback(() => {
    const newItem: SpotlightItemType = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      link: ''
    };
    setSpotlightItems(prev => [...(prev || []), newItem]);
    setIsDirty(true);
  }, []);

  const addMediaItem = useCallback(() => {
    const newItem: MediaItemType = {
      id: Date.now().toString(),
      type: '',
      title: ''
    };
    setMediaItems(prev => {
      // Make sure we're working with an array
      const currentItems = Array.isArray(prev) ? prev : [];
      return [...currentItems, newItem];
    });
    setIsDirty(true);
  }, []);

  const addShopItem = useCallback(() => {
    const newItem: ShopItemType = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      price: '',
      link: ''
    };
    setShopItems(prev => [...prev, newItem]);
    setIsDirty(true);
  }, []);

  // Remove items
  const removeSpotlightItem = useCallback((index: number) => {
    setSpotlightItems(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  }, []);

  const removeMediaItem = useCallback((index: number) => {
    setMediaItems(prev => {
      // Make sure we're working with an array
      const currentItems = Array.isArray(prev) ? prev : [];
      return currentItems.filter((_, i) => i !== index);
    });
    setIsDirty(true);
  }, []);

  const removeShopItem = useCallback((index: number) => {
    setShopItems(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  }, []);

  // Save all changes
  const saveAll = useCallback(() => {
    // Validate social links
    const errors: Array<{ platform: string; url: string }> = [];
    formData.socialLinks.forEach(link => {
      const validation = validateSocialUrl(link.platform, link.url);
      if (!validation.isValid) {
        errors.push({
          platform: link.platform,
          url: validation.message
        });
      }
    });

    setSocialLinkErrors(errors);

    if (errors.length === 0) {
      const updatedProfile = {
        ...formData,
        spotlightItems,
        mediaItems,
        shopItems
      };
      console.log('useProfileForm - saveAll success, returning:', {
        updatedProfile,
        spotlightItemsCount: spotlightItems?.length || 0,
        spotlightItems
      });
      setIsDirty(false);
      return updatedProfile;
    }
    
    console.warn('Save cancelled due to validation errors');
    // Return the current profile even if there are validation errors
    // This ensures we don't return null
    const fallbackProfile = {
      ...formData,
      spotlightItems,
      mediaItems,
      shopItems
    };
    console.log('useProfileForm - saveAll with validation errors, returning fallback:', {
      fallbackProfile,
      spotlightItemsCount: spotlightItems?.length || 0,
      spotlightItems
    });
    return fallbackProfile;
  }, [formData, spotlightItems, mediaItems, shopItems]);

  return {
    formData,
    updateProfile,
    handleImageUpload,
    handleSpotlightChange,
    handleSpotlightImageUpload,
    handleMediaChange,
    handleShopChange,
    handleShopImageUpload,
    handleStickerEnabledChange,
    handleStickerImageChange,
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
    shopItems,
    sticker: formData.sticker
  };
}; 