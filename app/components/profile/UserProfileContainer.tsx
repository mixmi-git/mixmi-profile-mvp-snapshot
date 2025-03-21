'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from '../../hooks/useAuthState';
import ProfileView from './ProfileView';
import ProfileEditor from './ProfileEditor';
import { Edit2 } from 'lucide-react';
import { exampleMediaItems, exampleSpotlightItems, exampleShopItems } from '@/lib/example-content';

// Storage keys for localStorage
const STORAGE_KEYS = {
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

// Define the mode state machine types
export enum ProfileMode {
  VIEW = 'view',
  EDIT = 'edit',
  PREVIEW = 'preview',
  LOADING = 'loading',
  SAVING = 'saving'
}

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
  };
  sticker?: {
    image: string;
    visible: boolean;
  };
  walletAddress?: string;
  showWalletAddress?: boolean;
  hasEditedProfile?: boolean;
  spotlightItems?: SpotlightItemType[];
  mediaItems?: MediaItemType[];
  shopItems?: ShopItemType[];
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
  
  // Optional props for testing/development
  initialMode?: ProfileMode;
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
    shop: true
  },
  sticker: {
    visible: true,
    image: "/images/stickers/daisy-blue.png"
  },
  hasEditedProfile: false
};

export interface ProfileEditorProps {
  profile: ProfileData;
  mediaItems: MediaItemType[];
  spotlightItems: SpotlightItemType[];
  shopItems: ShopItemType[];
  onSave: (updatedProfile: ProfileData) => Promise<void>;
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

const UserProfileContainer: React.FC<UserProfileContainerProps> = ({
  initialProfile = DEFAULT_PROFILE,
  initialSpotlightItems = [],
  initialShopItems = [],
  initialMediaItems = [],
  initialMode,
  disableAuth = false,
}) => {
  // Authentication state
  const { isAuthenticated, isTransitioning, handleLoginToggle, userAddress } = useAuthState();
  
  // URL query params for mode control (useful for development)
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  
  // State management
  const [currentMode, setCurrentMode] = useState<ProfileMode>(
    initialMode || 
    (modeParam && Object.values(ProfileMode).includes(modeParam as ProfileMode) 
      ? modeParam as ProfileMode 
      : ProfileMode.VIEW)
  );
  
  // State for profile data
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItemType[]>(initialMediaItems);
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItemType[]>(initialSpotlightItems);
  const [shopItems, setShopItems] = useState<ShopItemType[]>(initialShopItems);
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Debug logging for mode changes
  useEffect(() => {
    devLog('🔄 Mode changed:', {
      currentMode,
      isPreviewMode,
      canEdit: disableAuth || isAuthenticated
    });
  }, [currentMode, isPreviewMode, disableAuth, isAuthenticated]);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    // Only load data if we're in a browser environment
    if (typeof window !== 'undefined') {
      const savedProfile = getFromStorage<ProfileData>(STORAGE_KEYS.PROFILE, initialProfile);
      const savedSpotlightItems = getFromStorage<SpotlightItemType[]>(STORAGE_KEYS.SPOTLIGHT, initialSpotlightItems);
      const savedShopItems = getFromStorage<ShopItemType[]>(STORAGE_KEYS.SHOP, initialShopItems);
      const savedMediaItems = getFromStorage<MediaItemType[]>(STORAGE_KEYS.MEDIA, initialMediaItems);
      const savedSticker = getFromStorage<{ visible: boolean; image: string }>(
        STORAGE_KEYS.STICKER, 
        { 
          visible: true, 
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png" 
        }
      );
      
      // Check if this is a first-time user
      const isFirstTimeUser = 
        !localStorage.getItem(STORAGE_KEYS.PROFILE) || 
        !savedProfile.hasEditedProfile;
      
      devLog('📦 Loading data:', {
        isFirstTimeUser,
        savedProfile,
        spotlightItems: savedSpotlightItems?.length || 0,
        mediaItems: savedMediaItems?.length || 0,
        shopItems: savedShopItems?.length || 0
      });

      if (isFirstTimeUser) {
        // First time user - set up example content
        devLog('🎉 First-time user detected! Loading example content');
        
        const profileWithDefaults = {
          ...DEFAULT_PROFILE,
          id: Date.now().toString(),
          sectionVisibility: {
            spotlight: true,
            media: true,
            shop: true
          },
          sticker: {
            visible: true,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png"
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
        
        devLog('📦 Saved example content for first-time user');
      } else {
        // Returning user - load their saved content
        devLog('🔄 Returning user. Loading saved content');
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
  }, [initialProfile, initialSpotlightItems, initialShopItems, initialMediaItems]);
  
  // Function to handle mode transitions
  const transitionMode = (newMode: ProfileMode) => {
    devLog('🔄 Attempting mode transition:', { from: currentMode, to: newMode });
    
    // Define allowed transitions
    const allowedTransitions: Record<ProfileMode, ProfileMode[]> = {
      [ProfileMode.VIEW]: [ProfileMode.EDIT, ProfileMode.LOADING],
      [ProfileMode.EDIT]: [ProfileMode.VIEW, ProfileMode.PREVIEW, ProfileMode.SAVING],
      [ProfileMode.PREVIEW]: [ProfileMode.EDIT, ProfileMode.VIEW],
      [ProfileMode.LOADING]: [ProfileMode.VIEW, ProfileMode.EDIT],
      [ProfileMode.SAVING]: [ProfileMode.EDIT, ProfileMode.VIEW],
    };
    
    // Check if transition is allowed
    if (allowedTransitions[currentMode].includes(newMode)) {
      setCurrentMode(newMode);
      
      // Update preview mode state
      setIsPreviewMode(newMode === ProfileMode.PREVIEW);
      
      // Update URL param for dev purposes if we're in development
      if (process.env.NODE_ENV === 'development') {
        const params = new URLSearchParams(searchParams.toString());
        params.set('mode', newMode);
        router.replace(`?${params.toString()}`);
      }
      
      devLog('✅ Mode transition successful');
    } else {
      devLog('❌ Invalid mode transition:', { from: currentMode, to: newMode });
    }
  };
  
  // Save profile data to localStorage
  const saveProfileData = (updatedProfile: ProfileData) => {
    devLog('📦 Saving profile data:', updatedProfile);
    
    // Process media items to ensure they have embedUrl set properly
    if (updatedProfile.mediaItems && updatedProfile.mediaItems.length > 0) {
      updatedProfile.mediaItems = updatedProfile.mediaItems.map(item => {
        // Ensure embedUrl is set based on id if not already present
        if (!item.embedUrl && item.id) {
          item.embedUrl = item.id;
        }
        return item;
      });
    }
    
    // Save complete profile data
    const completeProfile = {
      ...updatedProfile,
      hasEditedProfile: true,
    };
    
    saveToStorage(STORAGE_KEYS.PROFILE, completeProfile);
    
    // Save individual sections
    if (updatedProfile.spotlightItems) {
      saveToStorage(STORAGE_KEYS.SPOTLIGHT, updatedProfile.spotlightItems);
    }
    
    if (updatedProfile.mediaItems) {
      saveToStorage(STORAGE_KEYS.MEDIA, updatedProfile.mediaItems);
    }
    
    if (updatedProfile.shopItems) {
      saveToStorage(STORAGE_KEYS.SHOP, updatedProfile.shopItems);
    }
    
    // Save sticker data separately
    if (updatedProfile.sticker) {
      saveToStorage(STORAGE_KEYS.STICKER, updatedProfile.sticker);
    }
    
    devLog('📦 Saved complete profile:', completeProfile);
    
    // Update state
    setProfile(completeProfile);
    setSpotlightItems(updatedProfile.spotlightItems || []);
    setMediaItems(updatedProfile.mediaItems || []);
    setShopItems(updatedProfile.shopItems || []);
  };
  
  // Function to handle saving profile data
  const handleSave = async (updatedProfile: ProfileData) => {
    // Saving profile data
    
    // Extract items from the updatedProfile if they exist
    const updatedSpotlightItems = updatedProfile.spotlightItems || spotlightItems;
    
    // Process media items to ensure they have proper embed URLs
    const updatedMediaItems = (updatedProfile.mediaItems || mediaItems).map(item => {
      // If the item is missing an embedUrl but has an id, use the id as a fallback
      if (!item.embedUrl && item.id) {
        return {
          ...item,
          embedUrl: item.id
        };
      }
      return item;
    });
    
    const updatedShopItems = updatedProfile.shopItems || shopItems;
    
    // Create a complete profile object with all data
    const completeProfile = {
      ...updatedProfile,
      hasEditedProfile: true,
      // Use the updated items
      spotlightItems: updatedSpotlightItems,
      mediaItems: updatedMediaItems,
      shopItems: updatedShopItems
    };
    
    // Save all data to localStorage
    saveProfileData(completeProfile);
    
    // Transition to view mode
    transitionMode(ProfileMode.VIEW);
  };

  // Function to handle preview mode
  const handlePreview = () => {
    transitionMode(ProfileMode.PREVIEW);
  };

  // Function to handle canceling edit mode
  const handleCancel = () => {
    transitionMode(ProfileMode.VIEW);
  };
  
  // Determine if user is authenticated for edit access
  const canEdit = disableAuth || isAuthenticated || process.env.NODE_ENV === 'development';
  
  // Enhanced debugging helper for authentication-related issues
  const logAuthState = (context: string) => {
    // Only log in development or if auth debugging is enabled
    const debugEnabled = process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && (window as any).toggleAuthDebug);
    
    if (debugEnabled) {
      devLog('🔑 Profile Auth State [', context, ']');
      devLog('isAuthenticated:', isAuthenticated);
      devLog('canEdit:', canEdit);
      devLog('userAddress:', userAddress || 'none');
      devLog('disableAuth:', disableAuth);
      devLog('🔑 Profile Auth State end');
    }
  };
  
  // Debug logging for authentication
  useEffect(() => {
    logAuthState('auth-change');
    
    // For testing in development only - remove for production
    if (process.env.NODE_ENV === 'development' && searchParams.get('forceAuth') === 'true') {
      devLog('🔧 DEV MODE: Authentication forced to true via URL param');
    }
  }, [isAuthenticated, canEdit, userAddress, disableAuth, searchParams]);
  
  // Handle initial page load authentication
  useEffect(() => {
    logAuthState('component-mount');
  }, []);
  
  // Function to immediately load example content without reload
  const loadExampleContent = () => {
    const profileWithExamples = {
      ...profile,
      sectionVisibility: {
        spotlight: true,
        media: true,
        shop: true
      },
      sticker: {
        visible: true,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png"
      },
      hasEditedProfile: false
    };
    
    devLog('📦 Loading example content');
    
    // Update state with example content
    setProfile(profileWithExamples);
    setSpotlightItems(exampleSpotlightItems);
    setShopItems(exampleShopItems);
    setMediaItems(exampleMediaItems);
    
    devLog('Example content loaded:',
      { profile: profileWithExamples, spotlight: exampleSpotlightItems.length, 
        media: exampleMediaItems.length, shop: exampleShopItems.length }
    );
  };
  
  // Add a function to reset profile data to defaults
  const resetToDefaults = () => {
    if (typeof window === 'undefined') return;
    
    // Clear all profile data from localStorage
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SPOTLIGHT);
    localStorage.removeItem(STORAGE_KEYS.SHOP);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    
    // Reset state to initial values with example content
    const resetProfile = {
      ...DEFAULT_PROFILE,
      hasEditedProfile: false,
      sectionVisibility: {
        spotlight: true,
        media: true,
        shop: true
      }
    };
    
    setProfile(resetProfile);
    setSpotlightItems(exampleSpotlightItems);
    setShopItems(exampleShopItems);
    setMediaItems(exampleMediaItems);
    
    devLog('Profile data reset with example content', {
      profile: resetProfile,
      spotlightItems: exampleSpotlightItems,
      mediaItems: exampleMediaItems,
      shopItems: exampleShopItems
    });
    
    // Force reload to ensure everything is fresh
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };
  
  // Mode change monitoring
  useEffect(() => {
    // Removed debug logging
  }, [currentMode, isPreviewMode, disableAuth, isAuthenticated]);
  
  // Render component based on current mode
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
          {currentMode === ProfileMode.VIEW && (
            <ProfileView
              profile={profile}
              mediaItems={mediaItems}
              spotlightItems={spotlightItems}
              shopItems={shopItems}
              isAuthenticated={canEdit}
              isTransitioning={isTransitioning}
              onEditProfile={() => transitionMode(ProfileMode.EDIT)}
            />
          )}
          
          {currentMode === ProfileMode.EDIT && (
            <div className="w-full min-h-screen flex flex-col">
              <div className="flex-1 overflow-y-auto bg-gray-900">
                <ProfileEditor
                  profile={profile}
                  mediaItems={mediaItems}
                  spotlightItems={spotlightItems}
                  shopItems={shopItems}
                  onSave={handleSave}
                  onPreview={handlePreview}
                  onCancel={handleCancel}
                  isPreviewMode={isPreviewMode}
                />
              </div>
            </div>
          )}
          
          {currentMode === ProfileMode.PREVIEW && (
            <>
              <div className="fixed top-0 left-0 right-0 bg-amber-600/95 backdrop-blur-sm z-50">
                <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-white">
                      PREVIEW MODE - Viewing your page as others will see it
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-10">
                <ProfileView
                  profile={profile}
                  mediaItems={mediaItems}
                  spotlightItems={spotlightItems}
                  shopItems={shopItems}
                  onEditProfile={() => {}}
                />
              </div>
              
              <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-amber-400 font-medium">
                      PREVIEW MODE
                    </div>
                    <button 
                      onClick={handlePreview}
                      className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors flex items-center border border-cyan-500/50 hover:border-cyan-500"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Return to Editor
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export { UserProfileContainer }; 