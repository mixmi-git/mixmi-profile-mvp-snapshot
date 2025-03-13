'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from '@/hooks/useAuthState';
import ProfileView from './ProfileView';
import ProfileEditor from './ProfileEditor';
import { NavbarContainer } from '../NavbarContainer'; // We'll need to create this or import it from elsewhere

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
}

export interface ShopItemType {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: string;
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
      setSpotlightItems(updatedProfile.spotlightItems);
    } else if ('mediaItems' in updatedProfile) {
      setMediaItems(updatedProfile.mediaItems);
    } else if ('shopItems' in updatedProfile) {
      setShopItems(updatedProfile.shopItems);
    } else {
      setProfile(prev => ({ ...prev, ...updatedProfile }));
    }
    
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