'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from '../../hooks/useAuthState';
import ProfileView from './ProfileView';
import ProfileEditor from './ProfileEditor';
import { Edit2 } from 'lucide-react';
import { exampleMediaItems, exampleSpotlightItems, exampleShopItems } from '@/lib/example-content';
import { ProfileEditorRefType } from './ProfileEditor';

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
  
  // Callback for mode changes
  onModeChange?: (mode: ProfileMode) => void;
  
  // Callback to provide editor actions to parent
  onCaptureEditorActions?: (actions: { save: () => void; cancel: () => void }) => void;
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
  onModeChange,
  onCaptureEditorActions,
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
            shop: true
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
      
      // Call the mode change callback if provided
      if (onModeChange) {
        onModeChange(newMode);
      }
      
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
    // Get appropriate storage keys based on profile ID
    const STORAGE_KEYS = profileId !== 'default' 
      ? getStorageKeys(profileId)
      : LEGACY_STORAGE_KEYS;
      
    devLog('📦 Saving profile data for profile ID:', profileId, updatedProfile);
    
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
    
    devLog('📦 Saved complete profile for profile ID:', profileId, completeProfile);
    
    // Update state
    setProfile(completeProfile);
    setSpotlightItems(updatedProfile.spotlightItems || []);
    setMediaItems(updatedProfile.mediaItems || []);
    setShopItems(updatedProfile.shopItems || []);
  };
  
  // Add a reference to access handleSave and handleCancel from outside components
  const editorActionsRef = useRef<{
    save: () => void;
    cancel: () => void;
  }>({
    save: () => transitionMode(ProfileMode.VIEW),
    cancel: () => transitionMode(ProfileMode.VIEW)
  });

  // Add a reference to access the editor's form data
  const editorRef = useRef<ProfileEditorRefType>(null);

  // Handle Save
  const handleSave = () => {
    console.log('Saving profile changes...');
    
    // Get the current edited profile from the editor reference
    let updatedProfile = { ...profile };
    
    // Try to get data from the editor ref if available
    if (editorRef.current?.getCurrentFormData) {
      const formData = editorRef.current.getCurrentFormData();
      updatedProfile = { 
        ...formData.profile
      };
    }
    
    // Set loading state while saving
    setIsLoading(true);
    
    // Log the changes for debugging
    console.log('Profile changes:', {
      original: profile,
      updated: updatedProfile
    });
    
    // Save profile changes with a brief delay to allow UI feedback
    setTimeout(() => {
      // Update the actual profile state with our edited data
      setProfile(updatedProfile);
      
      // Save to local storage for persistence
      try {
        const profileJSON = JSON.stringify({
          profile: updatedProfile,
          profileId,
          timestamp: new Date().toISOString()
        });
        
        localStorage.setItem(`mixmi-profile-${profileId}`, profileJSON);
        console.log('Saved profile to localStorage with ID:', profileId);
        
        // Mark last save time
        localStorage.setItem('mixmi-last-save', new Date().toISOString());
      } catch (error) {
        console.error('Error saving profile to localStorage:', error);
      }
      
      // Switch back to view mode
      setIsLoading(false);
      setCurrentMode(ProfileMode.VIEW);
      
      // Refresh auth state to ensure we don't lose connection
      if (typeof window !== 'undefined') {
        // Trigger an auth refresh after save completes
        setTimeout(() => {
          if (window.dispatchEvent) {
            // Use a custom event to notify other components
            const event = new CustomEvent('mixmi-profile-saved', { 
              detail: { profileId }
            });
            window.dispatchEvent(event);
            
            console.log('🔄 Triggering auth refresh after save');
            // Access the refreshAuthState from window if available
            if ((window as any).refreshAuthState) {
              (window as any).refreshAuthState();
            }
          }
        }, 500);
      }
    }, 500);
  };

  // Function to handle preview mode
  const handlePreview = () => {
    transitionMode(ProfileMode.PREVIEW);
  };

  // Function to handle canceling edit mode
  const handleCancel = () => {
    transitionMode(ProfileMode.VIEW);
  };
  
  // Expose the editor actions through the ref
  useEffect(() => {
    // Create a save function that will save data and transition to view mode
    const saveFunction = () => {
      // Get current form data from the editor if in edit mode and ref is available
      if (currentMode === ProfileMode.EDIT && editorRef.current) {
        const currentFormData = editorRef.current.getCurrentFormData();
        
        // Create a complete profile object with all form data
        const completeProfile = {
          ...currentFormData.profile,
          hasEditedProfile: true,
          spotlightItems: currentFormData.spotlightItems,
          mediaItems: currentFormData.mediaItems,
          shopItems: currentFormData.shopItems
        };
        
        // Save the data to localStorage
        saveProfileData(completeProfile);
      } else {
        // Fallback to using the current state data if not in edit mode or ref not available
        const completeProfile = {
          ...profile,
          hasEditedProfile: true,
          spotlightItems,
          mediaItems,
          shopItems
        };
        
        // Save the data to localStorage
        saveProfileData(completeProfile);
      }
      
      // Force transition back to view mode using the transition function
      transitionMode(ProfileMode.VIEW);
    };
    
    // Create a cancel function that will transition to view mode
    const cancelFunction = () => {
      transitionMode(ProfileMode.VIEW);
    };
    
    // Update the ref with the new functions
    editorActionsRef.current = {
      save: saveFunction,
      cancel: cancelFunction
    };
  }, [profile, mediaItems, spotlightItems, shopItems, currentMode]);
  
  // Debug changes to current mode
  useEffect(() => {
    console.log('🔍 UserProfileContainer mode update:', {
      mode: currentMode, 
      initialMode,
      profile: profile.name,
      isEditorVisible: currentMode === ProfileMode.EDIT
    });
  }, [currentMode, initialMode, profile]);

  // Mode change monitoring
  useEffect(() => {
    // When initialMode prop changes, update our internal mode
    if (initialMode !== undefined && initialMode !== currentMode) {
      console.log('📢 Updating mode from prop:', initialMode);
      setCurrentMode(initialMode);
    }
  }, [initialMode, currentMode]);
  
  // Make the editor actions available to the parent component
  useEffect(() => {
    // Call the onCaptureEditorActions callback when in edit mode
    if (currentMode === ProfileMode.EDIT && onCaptureEditorActions) {
      onCaptureEditorActions(editorActionsRef.current);
    }
  }, [onCaptureEditorActions, editorActionsRef.current, currentMode]);
  
  // Determine if user is authenticated for edit access
  const canEdit = disableAuth || isAuthenticated;
  
  // Enhanced debugging helper for authentication-related issues
  const logAuthState = (context: string) => {
    // Only log in development or if auth debugging is enabled
    const debugEnabled = process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && (window as any).toggleAuthDebug);
    
    if (debugEnabled) {
      devLog('🔑 Profile Auth State [', context, ']');
      devLog('isAuthenticated:', isAuthenticated);
      devLog('canEdit:', canEdit);
      devLog('userAddress:', userAddress || 'none');
      devLog('currentAccount:', currentAccount || 'none');
      devLog('profileId:', profileId);
      devLog('disableAuth:', disableAuth);
      devLog('🔑 Profile Auth State end');
    }
  };
  
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
    
    // Force a UI update in view mode when authentication changes
    if (currentMode === ProfileMode.VIEW) {
      // This will trigger ProfileView to re-render with the updated authentication state
      const updatedProfile = { ...profile };
      setProfile(updatedProfile);
    }
  }, [isAuthenticated, canEdit, userAddress, currentAccount, profileId, availableAccounts, currentMode]);
  
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
    
    // Get appropriate storage keys based on profile ID
    const STORAGE_KEYS = profileId !== 'default' 
      ? getStorageKeys(profileId)
      : LEGACY_STORAGE_KEYS;
    
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
          {/* Account Switcher for authenticated users */}
          {isAuthenticated && availableAccounts.length > 1 && (
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
          
          {currentMode === ProfileMode.VIEW && (
            <ProfileView
              profile={profile}
              mediaItems={mediaItems}
              spotlightItems={spotlightItems}
              shopItems={shopItems}
              isAuthenticated={isAuthenticated} 
              isTransitioning={isTransitioning}
              onEditProfile={() => transitionMode(ProfileMode.EDIT)}
            />
          )}
          
          {currentMode === ProfileMode.EDIT && (
            <div className="w-full min-h-screen flex flex-col">
              <div className="flex-1 overflow-y-auto bg-gray-900">
                <ProfileEditor
                  ref={editorRef}
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
                  <button 
                    onClick={handlePreview}
                    className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors flex items-center border border-gray-600"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Return to Editor
                  </button>
                </div>
              </div>
              
              <div className="mt-14">
                <ProfileView 
                  profile={profile}
                  mediaItems={mediaItems}
                  spotlightItems={spotlightItems}
                  shopItems={shopItems}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export { UserProfileContainer }; 