'use client';

import React, { useEffect, useState } from 'react';
import { ProfileData, SpotlightItem, MediaItem, ShopItem } from '@/types';
import { exampleMediaItems, exampleSpotlightItems, exampleShopItems } from '@/lib/example-content';
import ProfileView from './profile/ProfileView';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import PersonalInfoSection from './profile/PersonalInfoSection';
import { SocialLinksEditor } from './profile/SocialLinksEditor';
import { StickerSection } from './profile/StickerSection';
import { ProfileMode } from '@/types/ProfileMode';

// Default profile for development and testing
const DEFAULT_PROFILE: ProfileData = {
  id: 'default',
  name: 'Add Your Name',
  title: 'Add Your Title',
  bio: 'Tell us about yourself...',
  image: '/images/placeholder-profile.jpg',
  socialLinks: [],
  sectionVisibility: {
    spotlight: true,
    media: true,
    shop: true
  },
  walletAddress: '',
  showWalletAddress: true,
  hasEditedProfile: false
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

export function IntegratedProfile() {
  // State for profile data
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItem[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Simple storage keys
  const STORAGE_KEYS = {
    PROFILE: 'mixmi_profile_data',
    SPOTLIGHT: 'mixmi_spotlight_items',
    SHOP: 'mixmi_shop_items',
    MEDIA: 'mixmi_media_items',
    STICKER: 'mixmi_sticker_data'
  };

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Check localStorage on mount for existing wallet connection
  useEffect(() => {
    if (!isMounted) return;

    // Check for wallet connection
    const connected = localStorage.getItem('simple-wallet-connected') === 'true';
    const address = localStorage.getItem('simple-wallet-address');
    
    if (connected && address) {
      setIsAuthenticated(true);
      setUserAddress(address);
      console.log('✅ Restored wallet connection from localStorage:', address);
    }
  }, [isMounted]);
  
  // Quick initial setup to avoid blank screen
  useEffect(() => {
    if (!isMounted) return;

    // TEMPORARY FIX: Clear localStorage to prevent infinite loading loop
    // Alternative: Only clear profile data if there's an issue
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SHOP);
    console.log('🧹 Cleared profile and shop data from localStorage to prevent potential loading issues');
    
    // Immediately set some example data to show content while loading
    setProfile(DEFAULT_PROFILE);
    setSpotlightItems(exampleSpotlightItems);
    setShopItems(exampleShopItems);
    setMediaItems(exampleMediaItems);
    
    // Force loading complete after a very short delay
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [isMounted]);
  
  // Main content loading - more comprehensive but may take longer
  useEffect(() => {
    if (!isMounted) return;

    console.log('🔄 IntegratedProfile: Loading data from localStorage...');
    
    // Start with example data
    let currentProfile = {...DEFAULT_PROFILE};
    let currentSpotlightItems = [...exampleSpotlightItems];
    let currentShopItems = [...exampleShopItems];
    let currentMediaItems = [...exampleMediaItems];
    
    try {
      // Check if we have saved data
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (savedProfile) {
        currentProfile = JSON.parse(savedProfile);
        console.log('📦 Loaded profile from localStorage');
      }
      
      const savedSpotlight = localStorage.getItem(STORAGE_KEYS.SPOTLIGHT);
      if (savedSpotlight) {
        currentSpotlightItems = JSON.parse(savedSpotlight);
        console.log('📦 Loaded spotlight items from localStorage');
      }
      
      const savedShop = localStorage.getItem(STORAGE_KEYS.SHOP);
      if (savedShop) {
        currentShopItems = JSON.parse(savedShop);
        console.log('📦 Loaded shop items from localStorage');
      }
      
      const savedMedia = localStorage.getItem(STORAGE_KEYS.MEDIA);
      if (savedMedia) {
        currentMediaItems = JSON.parse(savedMedia);
        console.log('📦 Loaded media items from localStorage');
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      console.log('⚠️ Using example data as fallback');
    }
    
    // Update state
    setProfile(currentProfile);
    setSpotlightItems(currentSpotlightItems);
    setShopItems(currentShopItems);
    setMediaItems(currentMediaItems);
    
    // Save any example data to localStorage if nothing was there
    if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(currentProfile));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.SPOTLIGHT)) {
      localStorage.setItem(STORAGE_KEYS.SPOTLIGHT, JSON.stringify(currentSpotlightItems));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.SHOP)) {
      localStorage.setItem(STORAGE_KEYS.SHOP, JSON.stringify(currentShopItems));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(currentMediaItems));
    }
    
    // Ensure loading is complete
    setIsLoading(false);
  }, [isMounted]);
  
  // Save profile data to localStorage
  const saveProfileData = (updatedProfile: ProfileData) => {
    saveToStorage(STORAGE_KEYS.PROFILE, updatedProfile);
    setProfile(updatedProfile);
  };
  
  // Save spotlight items to localStorage
  const saveSpotlightItems = (items: SpotlightItem[]) => {
    saveToStorage(STORAGE_KEYS.SPOTLIGHT, items);
    setSpotlightItems(items);
  };
  
  // Save media items to localStorage
  const saveMediaItems = (items: MediaItem[]) => {
    saveToStorage(STORAGE_KEYS.MEDIA, items);
    setMediaItems(items);
  };
  
  // Save shop items to localStorage
  const saveShopItems = (items: ShopItem[]) => {
    saveToStorage(STORAGE_KEYS.SHOP, items);
    setShopItems(items);
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
  const handleProfileUpdate = (field: keyof ProfileData | 'profileInfo', value: any) => {
    const updatedProfile = {
      ...profile,
      ...(field === 'profileInfo' ? value : { [field]: value }),
      hasEditedProfile: true
    };
    
    saveProfileData(updatedProfile);
  };
  
  // Save sticker data to localStorage
  const saveStickerData = (stickerData: { visible: boolean; image: string }) => {
    saveToStorage(STORAGE_KEYS.STICKER, stickerData);
    setProfile(prev => ({
      ...prev,
      sticker: stickerData
    }));
  };
  
  // Connect wallet function
  const connectWallet = async () => {
    if (isAuthenticated) {
      // Handle disconnect
      setWalletStatus('Disconnecting wallet...');
      
      try {
        // Clear localStorage wallet connection state
        localStorage.removeItem('simple-wallet-connected');
        localStorage.removeItem('simple-wallet-address');
        
        // Update authentication state
        setIsAuthenticated(false);
        setUserAddress(null);
        setWalletStatus('Wallet disconnected');
        
        // Don't clear the wallet address or showWalletAddress setting from the profile
        // This allows the visibility setting to persist and be respected in read-only mode
        
        // Automatically clear status after 3 seconds
        setTimeout(() => setWalletStatus(null), 3000);
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        setWalletStatus(`Error disconnecting: ${error}`);
      }
      
      return;
    }
    
    // Connect flow
    setWalletStatus('Preparing wallet connection...');
    
    try {
      // Use the simpler, proven approach to connect
      setWalletStatus('Showing wallet dialog. Please check your browser extensions...');
      
      // Dynamically import minimal dependencies
      const { showConnect, AppConfig, UserSession } = await import('@stacks/connect');
      const appConfig = new AppConfig(['store_write']);
      const userSession = new UserSession({ appConfig });
      
      // Create a Promise that resolves when the wallet connection completes
      const walletConnectPromise = new Promise((resolve, reject) => {
        // Set a timeout to reject the promise after 30 seconds
        const connectionTimeout = setTimeout(() => {
          reject(new Error("Wallet connection timed out"));
        }, 30000);
        
        showConnect({
          appDetails: {
            name: 'Mixmi',
            icon: '/favicon.ico',
          },
          redirectTo: window.location.origin,
          onFinish: () => {
            clearTimeout(connectionTimeout);
            
            if (userSession.isUserSignedIn()) {
              const userData = userSession.loadUserData();
              const address = userData.profile.stxAddress.mainnet;
              
              setIsAuthenticated(true);
              setUserAddress(address);
              setWalletStatus(`Connected! Address: ${address.slice(0, 6)}...${address.slice(-4)}`);
              
              // Store in localStorage
              localStorage.setItem('simple-wallet-connected', 'true');
              localStorage.setItem('simple-wallet-address', address);
              
              // Update the profile with the wallet address
              const updatedProfile = {
                ...profile,
                walletAddress: address,
                showWalletAddress: profile.showWalletAddress ?? true // Preserve existing setting or default to true
              };
              
              // Save the updated profile
              saveProfileData(updatedProfile);
              
              // Automatically clear status after 5 seconds
              setTimeout(() => setWalletStatus(null), 5000);
            } else {
              setWalletStatus('Connection completed but not signed in');
            }
            resolve(true);
          },
          userSession,
        });
      });
      
      // Handle connection result or user cancellation
      await walletConnectPromise;
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setWalletStatus(`Connection error: ${error.message || 'Unknown error'}`);
      // If user closed the modal or cancelled, this will run
      console.log("User may have cancelled the wallet connection");
    } finally {
      // Always ensure loading state is cleared
      setIsLoading(false);
    }
  };
  
  // Add an effect to ensure loading state doesn't get stuck
  useEffect(() => {
    // Safety timeout to prevent infinite loading state
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("⚠️ Safety timeout triggered: forcing loading state to complete");
        setIsLoading(false);
      }
    }, 5000); // 5 second safety timeout
    
    return () => clearTimeout(timeout);
  }, [isLoading]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="h-8 w-auto relative">
              <img
                src="/images/logos/Logotype_Main.svg"
                alt="mixmi"
                className="h-8 w-auto"
              />
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && userAddress && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-300">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </span>
              </div>
            )}
            
            <button
              onClick={connectWallet}
              disabled={isLoading && !isAuthenticated}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                isAuthenticated 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              } ${isLoading && !isAuthenticated ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading && !isAuthenticated ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </span>
              ) : isAuthenticated ? (
                <span className="flex items-center">
                  <span className="hidden md:inline">Disconnect</span>
                  <span className="md:hidden">✕</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>Connect Wallet</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <button 
            onClick={() => setIsLoading(false)} 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cancel Loading
          </button>
          <div className="mt-6 text-center">
            <p className="text-gray-400 mb-2">Stuck loading? Try resetting the app:</p>
            <Link
              href="/reset"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              Reset Application Data
            </Link>
          </div>
        </div>
      ) : (
        <main className="flex-grow">
          <div className="mt-8 max-w-7xl mx-auto">
            <ProfileView
              profile={profile}
              mediaItems={mediaItems}
              spotlightItems={spotlightItems}
              shopItems={shopItems}
              isAuthenticated={isAuthenticated}
              isTransitioning={false}
              onUpdateProfile={handleProfileUpdate}
              onUpdateSpotlightItems={saveSpotlightItems}
              onUpdateMediaItems={saveMediaItems}
              onUpdateShopItems={saveShopItems}
              onUpdateStickerData={saveStickerData}
              onUpdateSectionVisibility={handleSectionVisibilityChange}
            />
          </div>
        </main>
      )}
    </div>
  );
} 