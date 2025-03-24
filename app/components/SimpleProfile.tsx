'use client';

import React, { useEffect, useState } from 'react';
import { ProfileMode, ProfileData, SpotlightItem, MediaItem, ShopItem } from '@/types';
import { exampleMediaItems, exampleSpotlightItems, exampleShopItems } from '@/lib/example-content';
import { NavbarContainer } from './NavbarContainer';
import ProfileView from './profile/ProfileView';

// Default profile structure
const DEFAULT_PROFILE: ProfileData = {
  id: 'default',
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

export function SimpleProfile() {
  // State for profile data
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItem[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Simple storage keys
  const STORAGE_KEYS = {
    PROFILE: 'mixmi_profile_data',
    SPOTLIGHT: 'mixmi_spotlight_items',
    SHOP: 'mixmi_shop_items',
    MEDIA: 'mixmi_media_items',
    STICKER: 'mixmi_sticker_data'
  };
  
  // Load data on component mount
  useEffect(() => {
    console.log('🔄 SimpleProfile: Loading data from localStorage...');
    
    // Start with example data
    let currentProfile = {...DEFAULT_PROFILE};
    let currentSpotlightItems = [...exampleSpotlightItems];
    let currentShopItems = [...exampleShopItems];
    let currentMediaItems = [...exampleMediaItems];
    
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
    }
    
    if (currentMediaItems.length === 0) {
      currentMediaItems = exampleMediaItems;
    }
    
    if (currentShopItems.length === 0) {
      currentShopItems = exampleShopItems;
    }
    
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
  
  // Toggle authentication for demo purposes
  const toggleAuth = () => {
    setIsAuthenticated(prev => !prev);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 right-0 mt-4 mr-4 z-50 flex space-x-2">
        <button 
          onClick={toggleAuth}
          className="px-4 py-2 bg-purple-600 text-white rounded-md"
        >
          {isAuthenticated ? 'Log Out' : 'Log In (Demo)'}
        </button>
        
        <a 
          href="/wallet"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Wallet Test
        </a>
        
        <a 
          href="/debug"
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Debug
        </a>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col bg-gray-900">
          <NavbarContainer isAuthenticated={isAuthenticated} />
          
          <main className="flex-grow">
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
          </main>
        </div>
      )}
    </div>
  );
} 