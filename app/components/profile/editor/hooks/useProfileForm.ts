import { useState, useCallback, useEffect } from 'react';
import { ProfileData, MediaItemType, SpotlightItemType, ShopItemType, SocialLinkError } from '../types/EditorTypes';
import { validateSocialUrl } from '@/lib/validation';

interface SocialLink {
  platform: string;
  url: string;
}

interface UseProfileFormProps {
  profile: ProfileData;
  mediaItems: MediaItemType[];
  spotlightItems: SpotlightItemType[];
  shopItems: ShopItemType[];
  onSave: (updatedProfile: ProfileData) => void;
}

interface DirtyState {
  profileDetails: boolean;
  socialLinks: boolean;
  spotlight: boolean;
  spotlightItems: boolean;
  media: boolean;
  shop: boolean;
}

export const useProfileForm = ({
  profile: initialProfile,
  mediaItems: initialMediaItems,
  spotlightItems: initialSpotlightItems,
  shopItems: initialShopItems,
  onSave
}: UseProfileFormProps) => {
  // Form state
  const [formProfile, setFormProfile] = useState<ProfileData>(initialProfile);
  const [formMediaItems, setFormMediaItems] = useState<MediaItemType[]>(initialMediaItems);
  const [formSpotlightItems, setFormSpotlightItems] = useState<SpotlightItemType[]>(initialSpotlightItems);
  const [formShopItems, setFormShopItems] = useState<ShopItemType[]>(initialShopItems);

  // Dirty state tracking
  const [dirtyState, setDirtyState] = useState<DirtyState>({
    profileDetails: false,
    socialLinks: false,
    spotlight: false,
    spotlightItems: false,
    media: false,
    shop: false,
  });

  // Profile image state
  const [profileImageToEdit, setProfileImageToEdit] = useState<string | null>(null);

  // Debug logging for form state updates
  useEffect(() => {
    console.log('🎵 useProfileForm - Media items updated:', formMediaItems);
  }, [formMediaItems]);

  // Update handlers
  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setFormProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const updateMediaItems = useCallback((updatedItems: MediaItemType[]) => {
    setFormMediaItems(updatedItems);
  }, []);

  const updateSpotlightItems = useCallback((updatedItems: SpotlightItemType[]) => {
    setFormSpotlightItems(updatedItems);
  }, []);

  const updateShopItems = useCallback((updatedItems: ShopItemType[]) => {
    setFormShopItems(updatedItems);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(() => {
    onSave({
      ...formProfile,
      mediaItems: formMediaItems,
      spotlightItems: formSpotlightItems,
      shopItems: formShopItems
    });
  }, [formProfile, formMediaItems, formSpotlightItems, formShopItems, onSave]);

  // Handlers for form fields
  const handleChange = useCallback((field: keyof ProfileData, value: any) => {
    setFormProfile((prev: ProfileData) => ({
      ...prev,
      [field]: value
    }));
    
    // Update dirty state based on field
    if (field === 'name' || field === 'title' || field === 'bio' || field === 'image' || field === 'walletAddress') {
      setDirtyState(prev => ({ ...prev, profileDetails: true }));
    } else if (field === 'socialLinks') {
      setDirtyState(prev => ({ ...prev, socialLinks: true }));
    }
  }, []);

  // Handler for profile image
  const handleProfileImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setProfileImageToEdit(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleProfileImageCrop = useCallback((croppedImage: string) => {
    handleChange('image', croppedImage);
    setProfileImageToEdit(null);
  }, [handleChange]);

  // Section-specific save handlers
  const saveProfileDetails = useCallback(() => {
    onSave({ ...formProfile });
    setDirtyState(prev => ({ ...prev, profileDetails: false }));
  }, [formProfile, onSave]);

  const saveSocialLinks = useCallback(() => {
    const errors: SocialLinkError[] = [];
    (formProfile.socialLinks as SocialLink[]).forEach(link => {
      const validationResult = validateSocialUrl(link.platform, link.url);
      if (!validationResult.isValid) {
        errors.push({ platform: link.platform, url: validationResult.message });
      }
    });

    if (errors.length === 0) {
      onSave({ ...formProfile });
      setDirtyState(prev => ({ ...prev, socialLinks: false }));
      return true;
    }
    return false;
  }, [formProfile, onSave]);

  const saveSpotlight = useCallback(() => {
    onSave({ ...formProfile, spotlightItems: formSpotlightItems });
    setDirtyState(prev => ({ ...prev, spotlight: false }));
  }, [formProfile, formSpotlightItems, onSave]);

  const saveMedia = useCallback(() => {
    onSave({ ...formProfile, mediaItems: formMediaItems });
    setDirtyState(prev => ({ ...prev, media: false }));
  }, [formProfile, formMediaItems, onSave]);

  const saveShop = useCallback(() => {
    onSave({ ...formProfile, shopItems: formShopItems });
    setDirtyState(prev => ({ ...prev, shop: false }));
  }, [formProfile, formShopItems, onSave]);

  // Save all sections
  const saveAll = useCallback(() => {
    onSave({
      ...formProfile,
      mediaItems: formMediaItems,
      spotlightItems: formSpotlightItems,
      shopItems: formShopItems
    });
    setDirtyState({
      profileDetails: false,
      socialLinks: false,
      spotlight: false,
      spotlightItems: false,
      media: false,
      shop: false,
    });
  }, [formProfile, formMediaItems, formSpotlightItems, formShopItems, onSave]);

  // Spotlight item handlers
  const handleSpotlightChange = useCallback((index: number, field: keyof SpotlightItemType, value: any) => {
    setFormSpotlightItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
    setDirtyState(prev => ({ ...prev, spotlight: true, spotlightItems: true }));
  }, []);

  const handleSpotlightImageUpload = useCallback((index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormSpotlightItems(prev => prev.map((item, i) => 
          i === index ? { ...item, image: e.target?.result as string } : item
        ));
        setDirtyState(prev => ({ ...prev, spotlight: true, spotlightItems: true }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const addSpotlightItem = useCallback(() => {
    const newItem: SpotlightItemType = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      link: ''
    };
    setFormSpotlightItems(prev => [...prev, newItem]);
    setDirtyState(prev => ({ ...prev, spotlight: true, spotlightItems: true }));
  }, []);

  const removeSpotlightItem = useCallback((index: number) => {
    setFormSpotlightItems(prev => prev.filter((_, i) => i !== index));
    setDirtyState(prev => ({ ...prev, spotlight: true, spotlightItems: true }));
  }, []);

  return {
    formProfile,
    formMediaItems,
    formSpotlightItems,
    formShopItems,
    profileImageToEdit,
    dirtyState,
    handleChange,
    handleProfileImageUpload,
    handleProfileImageCrop,
    handleSpotlightChange,
    handleSpotlightImageUpload,
    addSpotlightItem,
    removeSpotlightItem,
    updateProfile,
    updateMediaItems,
    updateSpotlightItems,
    updateShopItems,
    handleSubmit,
    saveProfileDetails,
    saveSocialLinks,
    saveSpotlight,
    saveMedia,
    saveShop,
    saveAll
  };
}; 