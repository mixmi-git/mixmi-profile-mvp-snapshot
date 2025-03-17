'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from '@/hooks/useAuthState';
import ProfileView from './ProfileView';
import ProfileEditor from './ProfileEditor';
import { NavbarContainer } from '../NavbarContainer'; // We'll need to create this or import it from elsewhere

// Storage keys for localStorage
const STORAGE_KEYS = {
  PROFILE: 'mixmi_profile_data',
  SPOTLIGHT: 'mixmi_spotlight_items',
  SHOP: 'mixmi_shop_items',
  MEDIA: 'mixmi_media_items'
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
export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  image: string;
  sticker?: {
    image: string;
    position?: string;
    visible?: boolean;
  };
  wallet?: {
    address: string;
    visible: boolean;
  };
  socialLinks: {
    platform: string;
    url: string;
  }[];
  sectionVisibility?: {
    spotlight: boolean;
    media: boolean;
    shop: boolean;
  };
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
  embedUrl: string;
  title?: string;
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

// Set default placeholder values for the view component
// These are just placeholders - the real ones will be in the main component
const DEFAULT_PROFILE: ProfileData = {
  name: 'Your Name',
  title: 'Your Role / Title',
  bio: 'Tell your story here...',
  image: '/images/placeholder.png',
  socialLinks: [],
  sectionVisibility: {
    spotlight: true,
    media: true,
    shop: true
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
  const { isAuthenticated, isTransitioning, handleLoginToggle } = useAuthState();
  
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
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItemType[]>(initialSpotlightItems);
  const [shopItems, setShopItems] = useState<ShopItemType[]>(initialShopItems);
  const [mediaItems, setMediaItems] = useState<MediaItemType[]>(initialMediaItems);
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    // Only load data if we're in a browser environment
    if (typeof window !== 'undefined') {
      const savedProfile = getFromStorage<ProfileData>(STORAGE_KEYS.PROFILE, initialProfile);
      const savedSpotlightItems = getFromStorage<SpotlightItemType[]>(STORAGE_KEYS.SPOTLIGHT, initialSpotlightItems);
      const savedShopItems = getFromStorage<ShopItemType[]>(STORAGE_KEYS.SHOP, initialShopItems);
      const savedMediaItems = getFromStorage<MediaItemType[]>(STORAGE_KEYS.MEDIA, initialMediaItems);
      
      setProfile(savedProfile);
      setSpotlightItems(savedSpotlightItems);
      setShopItems(savedShopItems);
      setMediaItems(savedMediaItems);
      
      console.log('Loaded profile data from localStorage');
    }
  }, [initialProfile, initialSpotlightItems, initialShopItems, initialMediaItems]);
  
  // Function to handle mode transitions
  const transitionMode = (newMode: ProfileMode) => {
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
      
      // Update URL param for dev purposes if we're in development
      if (process.env.NODE_ENV === 'development') {
        const params = new URLSearchParams(searchParams.toString());
        params.set('mode', newMode);
        router.replace(`?${params.toString()}`);
      }
    } else {
      console.error(`Invalid mode transition from ${currentMode} to ${newMode}`);
    }
  };
  
  // Switch to edit mode
  const handleEditProfile = () => {
    transitionMode(ProfileMode.EDIT);
  };
  
  // Return to view mode
  const handleDoneEditing = () => {
    // Save all data to localStorage before returning to view mode
    saveToStorage(STORAGE_KEYS.PROFILE, profile);
    saveToStorage(STORAGE_KEYS.SPOTLIGHT, spotlightItems);
    saveToStorage(STORAGE_KEYS.SHOP, shopItems);
    saveToStorage(STORAGE_KEYS.MEDIA, mediaItems);
    console.log('Saved all profile data to localStorage');
    
    transitionMode(ProfileMode.VIEW);
  };
  
  // Toggle preview mode when in edit mode
  const togglePreview = () => {
    if (currentMode === ProfileMode.EDIT) {
      transitionMode(ProfileMode.PREVIEW);
    } else if (currentMode === ProfileMode.PREVIEW) {
      transitionMode(ProfileMode.EDIT);
    }
  };
  
  // Handle saving profile changes
  const handleSave = async (updatedProfile: Partial<ProfileData> | { spotlightItems: SpotlightItemType[] } | { mediaItems: MediaItemType[] } | { shopItems: ShopItemType[] }) => {
    // For immediate UI updates, apply changes directly to state
    if ('spotlightItems' in updatedProfile) {
      // Filter out empty spotlight items
      const filteredItems = updatedProfile.spotlightItems.filter(
        item => item.title.trim() || item.description.trim()
      );
      setSpotlightItems(filteredItems);
      saveToStorage(STORAGE_KEYS.SPOTLIGHT, filteredItems);
    } else if ('mediaItems' in updatedProfile) {
      setMediaItems(updatedProfile.mediaItems);
      saveToStorage(STORAGE_KEYS.MEDIA, updatedProfile.mediaItems);
    } else if ('shopItems' in updatedProfile) {
      setShopItems(updatedProfile.shopItems);
      saveToStorage(STORAGE_KEYS.SHOP, updatedProfile.shopItems);
    } else {
      const updatedProfileData = { ...profile, ...updatedProfile };
      setProfile(updatedProfileData);
      saveToStorage(STORAGE_KEYS.PROFILE, updatedProfileData);
    }
    
    console.log('Saved changes to localStorage');
    
    // If we wanted to simulate an API call, we could uncomment this:
    // transitionMode(ProfileMode.SAVING);
    // setIsLoading(true);
    // try {
    //   // Simulated API call delay
    //   await new Promise(resolve => setTimeout(resolve, 500));
    //   transitionMode(ProfileMode.EDIT);
    // } catch (error) {
    //   console.error('Error saving profile:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };
  
  // Determine if user is authenticated for edit access
  const canEdit = disableAuth || isAuthenticated;
  
  // For development - Force authentication on if needed
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && searchParams.get('forceAuth') === 'true') {
      console.log('DEV MODE: Authentication forced to true');
    }
  }, [searchParams]);
  
  // For development purposes, let's add a mode switcher component when in dev mode
  const DevModeSwitcher = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 p-2 rounded text-xs z-50">
        <div className="mb-2 text-white font-bold">Dev Controls</div>
        <div className="flex space-x-2">
          {Object.values(ProfileMode).map(mode => (
            <button
              key={mode}
              onClick={() => transitionMode(mode)}
              className={`px-2 py-1 rounded ${currentMode === mode ? 'bg-green-500' : 'bg-gray-700'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
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
    
    // Reset state to initial values
    setProfile(initialProfile);
    setSpotlightItems(initialSpotlightItems);
    setShopItems(initialShopItems);
    setMediaItems(initialMediaItems);
    
    console.log('Reset profile data to defaults');
  };
  
  // Render component based on current mode
  return (
    <div className="dark min-h-screen bg-gray-900 text-gray-100">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes sticker-rotate {
          0% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
          100% { transform: rotate(-5deg); }
        }
        .animate-sticker-rotate {
          animation: sticker-rotate 6s ease-in-out infinite;
        }
      `}</style>
      
      <NavbarContainer />
      
      {/* Show a debug control panel in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-900 p-2 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Debug Controls:</span>
            <button 
              onClick={resetToDefaults}
              className="text-xs px-2 py-1 bg-red-800 hover:bg-red-700 text-white rounded"
            >
              Reset to Defaults
            </button>
          </div>
          <div className="text-xs text-gray-400">
            Mode: {currentMode}
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <>
          {currentMode === ProfileMode.VIEW && (
            <ProfileView
              profile={profile}
              mediaItems={mediaItems}
              spotlightItems={spotlightItems}
              shopItems={shopItems}
              isAuthenticated={canEdit}
              isTransitioning={isTransitioning}
              onEditProfile={handleEditProfile}
            />
          )}
          
          {currentMode === ProfileMode.EDIT && (
            <ProfileEditor
              profile={profile}
              mediaItems={mediaItems}
              spotlightItems={spotlightItems}
              shopItems={shopItems}
              onSave={handleSave}
              onPreviewToggle={togglePreview}
              onDoneEditing={handleDoneEditing}
              isPreviewMode={false}
            />
          )}
          
          {currentMode === ProfileMode.PREVIEW && (
            <>
              <ProfileView
                profile={profile}
                mediaItems={mediaItems}
                spotlightItems={spotlightItems}
                shopItems={shopItems}
                isAuthenticated={false}
                isTransitioning={false}
              />
              
              {/* Preview mode footer */}
              <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-amber-400">
                      PREVIEW MODE
                    </div>
                  </div>
                  <button 
                    onClick={togglePreview}
                    className="px-6 py-2 text-lg border-2 border-amber-500/60 hover:border-amber-500/80 transition-colors rounded-md"
                  >
                    Exit Preview
                  </button>
                </div>
              </div>
            </>
          )}
          
          {/* Dev controls */}
          {process.env.NODE_ENV === 'development' && <DevModeSwitcher />}
        </>
      )}
    </div>
  );
};

export default UserProfileContainer; 