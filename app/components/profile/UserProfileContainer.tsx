'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from '../../hooks/useAuthState';
import ProfileView from './ProfileView';
import { Edit2 } from 'lucide-react';
import { exampleMediaItems, exampleSpotlightItems, exampleShopItems } from '@/lib/example-content';

// Storage keys for localStorage with dynamic profile ID support
const getStorageKeys = (profileId: string) => ({
  PROFILE: `mixmi_profile_data_${profileId}`,
  SPOTLIGHT: `mixmi_spotlight_items_${profileId}`,
  SHOP: `mixmi_shop_items_${profileId}`,
  MEDIA: `mixmi_media_items_${profileId}`,
  STICKER: `mixmi_sticker_data_${profileId}`
});

// For backwards compatibility
const LEGACY_STORAGE_KEYS = {
  PROFILE: 'mixmi_profile_data',
  SPOTLIGHT: 'mixmi_spotlight_items',
  SHOP: 'mixmi_shop_items',
  MEDIA: 'mixmi_media_items',
  STICKER: 'mixmi_sticker_data'
};

// Helper function to safely get data from localStorage
const getFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return fallback;
  }
};

// Helper function to safely save data to localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Define the interfaces for our component props
export interface SocialLinkType {
  platform: string;
  url: string;
}

export interface ProfileData {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  socialLinks: SocialLinkType[];
  sectionVisibility?: {
    spotlight?: boolean;
    media?: boolean;
    shop?: boolean;
    sticker?: boolean;
  };
  sticker?: {
    image: string;
    visible: boolean;
  };
  walletAddress?: string;
  showWalletAddress?: boolean;
  hasEditedProfile?: boolean;
}

export interface SpotlightItemType {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export interface ShopItemType {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: string;
  link?: string;
}

export interface MediaItemType {
  id: string;
  type: string;
  title?: string;
  rawUrl?: string;
  embedUrl?: string;
}

export interface UserProfileContainerProps {
  initialProfile?: ProfileData;
  initialSpotlightItems?: SpotlightItemType[];
  initialShopItems?: ShopItemType[];
  initialMediaItems?: MediaItemType[];
  disableAuth?: boolean;
}

// Default profile structure
const DEFAULT_PROFILE: ProfileData = {
  id: '',
  name: 'Your Name',
  title: 'Your Title',
  bio: 'Tell your story here...',
  image: '',
  socialLinks: [],
  sectionVisibility: {
    spotlight: true,
    media: true,
    shop: true,
    sticker: true
  },
  sticker: {
    visible: true,
    image: "/images/stickers/daisy-blue.png"
  },
  hasEditedProfile: false
};

// Development-only logging utility
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

/**
 * UserProfileContainer - The main container for the profile page
 * Manages authentication, profile data, and edit-in-place functionality
 */
const UserProfileContainer: React.FC<UserProfileContainerProps> = ({
  initialProfile = DEFAULT_PROFILE,
  initialSpotlightItems = [],
  initialShopItems = [],
  initialMediaItems = [],
  disableAuth = false,
}) => {
  // Authentication state
  const { 
    isAuthenticated, 
    isTransitioning, 
    handleLoginToggle, 
    userAddress,
    currentAccount,
    availableAccounts,
    switchAccount,
    getProfileIdForAddress
  } = useAuthState();
  
  // Profile ID (based on current account)
  const [profileId, setProfileId] = useState<string>('default');
  
  // Setup profile ID when authentication changes
  useEffect(() => {
    if (isAuthenticated && currentAccount) {
      // Get profile ID for this account
      const accountProfileId = getProfileIdForAddress(currentAccount);
      if (accountProfileId) {
        setProfileId(accountProfileId);
      } else {
        // Default to the account address as a fallback
        setProfileId(currentAccount.slice(0, 10)); // Use first 10 chars of address
      }
    } else {
      // Not authenticated, use default profile
      setProfileId('default');
    }
  }, [isAuthenticated, currentAccount, getProfileIdForAddress]);
  
  // State for profile data
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [mediaItems, setMediaItems] = useState<MediaItemType[]>(initialMediaItems);
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItemType[]>(initialSpotlightItems);
  const [shopItems, setShopItems] = useState<ShopItemType[]>(initialShopItems);
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load data from localStorage on component mount or when profile ID changes
  useEffect(() => {
    // Only load data if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Get appropriate storage keys based on profile ID
      const STORAGE_KEYS = profileId !== 'default' 
        ? getStorageKeys(profileId)
        : LEGACY_STORAGE_KEYS;
      
      const savedProfile = getFromStorage<ProfileData>(STORAGE_KEYS.PROFILE, initialProfile);
      const savedSpotlightItems = getFromStorage<SpotlightItemType[]>(STORAGE_KEYS.SPOTLIGHT, initialSpotlightItems);
      const savedShopItems = getFromStorage<ShopItemType[]>(STORAGE_KEYS.SHOP, initialShopItems);
      const savedMediaItems = getFromStorage<MediaItemType[]>(STORAGE_KEYS.MEDIA, initialMediaItems);
      const savedSticker = getFromStorage<{ visible: boolean; image: string }>(
        STORAGE_KEYS.STICKER, 
        { 
          visible: true, 
          image: "/images/stickers/daisy-blue.png" 
        }
      );
      
      // Check if this is a first-time user for this profile
      const isFirstTimeUser = 
        !localStorage.getItem(STORAGE_KEYS.PROFILE) || 
        !savedProfile.hasEditedProfile;
      
      devLog('📦 Loading data for profile ID:', profileId, {
        isFirstTimeUser,
        savedProfile,
        spotlightItems: savedSpotlightItems?.length || 0,
        mediaItems: savedMediaItems?.length || 0,
        shopItems: savedShopItems?.length || 0
      });

      if (isFirstTimeUser) {
        // First time user - set up example content
        devLog('🎉 First-time user detected for profile ID:', profileId, 'Loading example content');
        
        const profileWithDefaults = {
          ...DEFAULT_PROFILE,
          id: profileId || Date.now().toString(),
          sectionVisibility: {
            spotlight: true,
            media: true,
            shop: true,
            sticker: true
          },
          sticker: {
            visible: true,
            image: "/images/stickers/daisy-blue.png"
          }
        };
        
        setProfile(profileWithDefaults);
        setSpotlightItems(exampleSpotlightItems);
        setShopItems(exampleShopItems);
        setMediaItems(exampleMediaItems);
        
        // Save example content to localStorage
        saveToStorage(STORAGE_KEYS.PROFILE, profileWithDefaults);
        saveToStorage(STORAGE_KEYS.SPOTLIGHT, exampleSpotlightItems);
        saveToStorage(STORAGE_KEYS.SHOP, exampleShopItems);
        saveToStorage(STORAGE_KEYS.MEDIA, exampleMediaItems);
        saveToStorage(STORAGE_KEYS.STICKER, savedSticker);
        
        devLog('📦 Saved example content for first-time user with profile ID:', profileId);
      } else {
        // Returning user - load their saved content
        devLog('🔄 Returning user with profile ID:', profileId, 'Loading saved content');
        setProfile(savedProfile);
        setSpotlightItems(savedSpotlightItems || []);
        setShopItems(savedShopItems || []);
        setMediaItems(savedMediaItems?.length > 0 ? savedMediaItems : [{
          id: Date.now().toString(),
          type: '',
          title: ''
        }]);
      }
    }
  }, [initialProfile, initialSpotlightItems, initialShopItems, initialMediaItems, profileId]);
  
  // Save profile data to localStorage
  const saveProfileData = (updatedProfile: ProfileData) => {
    // Get appropriate storage keys based on profile ID
    const STORAGE_KEYS = profileId !== 'default' 
      ? getStorageKeys(profileId)
      : LEGACY_STORAGE_KEYS;
      
    devLog('📦 Saving profile data for profile ID:', profileId, updatedProfile);
    
    // Save complete profile data
    const completeProfile = {
      ...updatedProfile,
      hasEditedProfile: true,
    };
    
    saveToStorage(STORAGE_KEYS.PROFILE, completeProfile);
    setProfile(completeProfile);
    devLog('📦 Saved profile for profile ID:', profileId);
  };
  
  // Save spotlight items to localStorage
  const saveSpotlightItems = (items: SpotlightItemType[]) => {
    const STORAGE_KEYS = profileId !== 'default' 
      ? getStorageKeys(profileId)
      : LEGACY_STORAGE_KEYS;
    
    saveToStorage(STORAGE_KEYS.SPOTLIGHT, items);
    setSpotlightItems(items);
    devLog('📦 Saved spotlight items for profile ID:', profileId);
  };
  
  // Save media items to localStorage
  const saveMediaItems = (items: MediaItemType[]) => {
    const STORAGE_KEYS = profileId !== 'default' 
      ? getStorageKeys(profileId)
      : LEGACY_STORAGE_KEYS;
    
    saveToStorage(STORAGE_KEYS.MEDIA, items);
    setMediaItems(items);
    devLog('📦 Saved media items for profile ID:', profileId);
  };
  
  // Save shop items to localStorage
  const saveShopItems = (items: ShopItemType[]) => {
    const STORAGE_KEYS = profileId !== 'default' 
      ? getStorageKeys(profileId)
      : LEGACY_STORAGE_KEYS;
    
    saveToStorage(STORAGE_KEYS.SHOP, items);
    setShopItems(items);
    devLog('📦 Saved shop items for profile ID:', profileId);
  };
  
  // Save sticker data to localStorage
  const saveStickerData = (stickerData: { visible: boolean; image: string }) => {
    const STORAGE_KEYS = profileId !== 'default' 
      ? getStorageKeys(profileId)
      : LEGACY_STORAGE_KEYS;
    
    saveToStorage(STORAGE_KEYS.STICKER, stickerData);
    setProfile(prev => ({
      ...prev,
      sticker: stickerData
    }));
    devLog('📦 Saved sticker data for profile ID:', profileId);
  };
  
  // Handle section visibility changes
  const handleSectionVisibilityChange = (field: keyof ProfileData['sectionVisibility'], value: boolean) => {
    const updatedProfile = {
      ...profile,
      sectionVisibility: {
        ...profile.sectionVisibility,
        [field]: value
      }
    };
    
    saveProfileData(updatedProfile);
  };
  
  // Handle profile field updates
  const handleProfileUpdate = (field: keyof ProfileData, value: any) => {
    const updatedProfile = {
      ...profile,
      [field]: value,
      hasEditedProfile: true
    };
    
    saveProfileData(updatedProfile);
  };
  
  // Determine if user is authenticated for edit access
  const canEdit = disableAuth || isAuthenticated;
  
  // Debug logging for authentication
  useEffect(() => {
    console.log('🧩 UserProfileContainer Auth State:', {
      isAuthenticated,
      canEdit,
      userAddress,
      currentAccount,
      profileId,
      availableAccounts: availableAccounts?.length || 0
    });
  }, [isAuthenticated, canEdit, userAddress, currentAccount, profileId, availableAccounts]);
  
  // Render the profile with edit-in-place capability
  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes sticker-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-sticker-rotate {
          animation: sticker-rotate 12s linear infinite;
        }
      `}</style>
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col bg-gray-900">
          {/* Account Switcher for authenticated users */}
          {isAuthenticated && availableAccounts?.length > 1 && (
            <div className="bg-gray-800 border-b border-gray-700">
              <div className="container mx-auto px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">Active Account:</span>
                    <select 
                      className="bg-gray-700 text-white rounded px-3 py-1 text-sm"
                      value={currentAccount || ''}
                      onChange={(e) => switchAccount(e.target.value)}
                    >
                      {availableAccounts.map((account: string) => (
                        <option key={account} value={account}>
                          {account.slice(0, 6)}...{account.slice(-4)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-gray-500">
                    Profile ID: {profileId}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Pass everything to ProfileView, including edit callbacks */}
          <ProfileView
            profile={profile}
            mediaItems={mediaItems}
            spotlightItems={spotlightItems}
            shopItems={shopItems}
            isAuthenticated={canEdit}
            isTransitioning={isTransitioning}
            onUpdateProfile={handleProfileUpdate}
            onUpdateSpotlightItems={saveSpotlightItems}
            onUpdateMediaItems={saveMediaItems}
            onUpdateShopItems={saveShopItems}
            onUpdateStickerData={saveStickerData}
            onUpdateSectionVisibility={handleSectionVisibilityChange}
          />
        </div>
      )}
    </div>
  );
};

export { UserProfileContainer }; 