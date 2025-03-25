'use client';

import React, { useEffect, useState } from 'react';
import { ProfileData, SpotlightItem, MediaItem, ShopItem } from '@/types';
import { exampleMediaItems, exampleSpotlightItems, exampleShopItems } from '@/lib/example-content';
import ProfileView from './profile/ProfileView';
import Link from 'next/link';

// Default profile structure
const DEFAULT_PROFILE: ProfileData = {
  id: 'default',
  name: 'Your Name',
  title: 'What You Do',
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
  
  // Simple storage keys
  const STORAGE_KEYS = {
    PROFILE: 'mixmi_profile_data',
    SPOTLIGHT: 'mixmi_spotlight_items',
    SHOP: 'mixmi_shop_items',
    MEDIA: 'mixmi_media_items',
    STICKER: 'mixmi_sticker_data'
  };
  
  // Check localStorage on mount for existing wallet connection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for wallet connection
      const connected = localStorage.getItem('simple-wallet-connected') === 'true';
      const address = localStorage.getItem('simple-wallet-address');
      
      if (connected && address) {
        setIsAuthenticated(true);
        setUserAddress(address);
        console.log('✅ Restored wallet connection from localStorage:', address);
      }
    }
  }, []);
  
  // Quick initial setup to avoid blank screen
  useEffect(() => {
    // TEMPORARY FIX: Clear localStorage to prevent infinite loading loop
    if (typeof window !== 'undefined') {
      // Only clear if you're experiencing infinite loading
      // Uncomment the next line to reset all data
      // localStorage.clear();
      
      // Alternative: Only clear profile data if there's an issue
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      console.log('🧹 Cleared profile data from localStorage to prevent potential loading issues');
    }
    
    // Immediately set some example data to show content while loading
    setProfile(DEFAULT_PROFILE);
    setSpotlightItems(exampleSpotlightItems);
    setShopItems(exampleShopItems);
    setMediaItems(exampleMediaItems);
    
    // Force loading complete after a very short delay
    // This ensures the UI is responsive immediately
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Main content loading - more comprehensive but may take longer
  useEffect(() => {
    console.log('🔄 IntegratedProfile: Loading data from localStorage...');
    
    // Start with example data
    let currentProfile = {...DEFAULT_PROFILE};
    let currentSpotlightItems = [...exampleSpotlightItems];
    let currentShopItems = [...exampleShopItems];
    let currentMediaItems = [...exampleMediaItems];
    
    // Debug log - initial example data counts
    console.log('📊 Initial example data counts:', {
      spotlightItems: exampleSpotlightItems.length,
      mediaItems: exampleMediaItems.length,
      shopItems: exampleShopItems.length
    });
    
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
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
    }
    
    // Always ensure we have example data if nothing is loaded
    if (currentSpotlightItems.length === 0) {
      currentSpotlightItems = exampleSpotlightItems;
      console.log('⚠️ No spotlight items found, using example data');
    }
    
    if (currentMediaItems.length === 0) {
      currentMediaItems = exampleMediaItems;
      console.log('⚠️ No media items found, using example data');
    }
    
    if (currentShopItems.length === 0) {
      currentShopItems = exampleShopItems;
      console.log('⚠️ No shop items found, using example data');
    }
    
    // Debug log - final data counts
    console.log('📊 Final data counts after loading:', {
      spotlightItems: currentSpotlightItems.length,
      mediaItems: currentMediaItems.length,
      shopItems: currentShopItems.length
    });
    
    // Debug - show section visibility
    console.log('👁️ Section visibility settings:', currentProfile.sectionVisibility);
    
    // Update state
    setProfile(currentProfile);
    setSpotlightItems(currentSpotlightItems);
    setShopItems(currentShopItems);
    setMediaItems(currentMediaItems);
    
    // Save any example data to localStorage if nothing was there
    if (typeof window !== 'undefined') {
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
    }
    
    // Ensure loading is complete
    setIsLoading(false);
  }, []);
  
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
  const handleProfileUpdate = (field: keyof ProfileData, value: any) => {
    const updatedProfile = {
      ...profile,
      [field]: value,
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
        // Clear localStorage
        localStorage.removeItem('simple-wallet-connected');
        localStorage.removeItem('simple-wallet-address');
        
        setIsAuthenticated(false);
        setUserAddress(null);
        setWalletStatus('Wallet disconnected');
        
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
            {walletStatus && (
              <div className="text-sm text-cyan-400 animate-pulse mr-2">
                {walletStatus}
              </div>
            )}
            
            <button
              onClick={connectWallet}
              disabled={isLoading && !isAuthenticated} // Only disable if loading and not authenticated
              className={`px-4 py-2 rounded text-white ${
                isAuthenticated ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              } ${isLoading && !isAuthenticated ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading && !isAuthenticated ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </span>
              ) : isAuthenticated ? (
                <span>✓ Disconnect Wallet</span>
              ) : (
                <span>🔑 Connect Wallet</span>
              )}
            </button>
            
            <div className="flex space-x-2">
              <Link 
                href="/wallet"
                className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm"
              >
                Wallet Test
              </Link>
              
              <Link 
                href="/debug"
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
              >
                Debug
              </Link>
            </div>
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