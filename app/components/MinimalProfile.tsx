'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Simple StickerDisplay component
const StickerDisplay = ({ sticker }: { sticker?: { visible: boolean; image: string } }) => {
  if (!sticker || !sticker.visible || !sticker.image) return null;
  
  return (
    <div className="flex justify-center mt-24 mb-12">
      <div className="sticker-rotate">
        <img 
          src={sticker.image} 
          alt="Sticker" 
          className="w-24 h-24 md:w-32 md:h-32"
        />
      </div>
    </div>
  );
};

// Media embed component for rendering different types of media
const MediaEmbed = ({ item }: { item: any }) => {
  if (!item.embedUrl) return null;

  // Detect YouTube embed URL
  if (item.type === 'youtube') {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe 
          src={item.embedUrl}
          title={item.title || "YouTube video"}
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    );
  }

  // Spotify embed
  if (item.type.includes('spotify')) {
    return (
      <div className={item.type === 'spotify-playlist' ? "h-[380px]" : "h-[152px]"}>
        <iframe 
          src={item.embedUrl}
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allow="encrypted-media"
          className="rounded-lg"
        ></iframe>
      </div>
    );
  }

  // SoundCloud embed
  if (item.type.includes('soundcloud')) {
    return (
      <div className={item.type === 'soundcloud-playlist' ? "h-[300px]" : "h-[166px]"}>
        <iframe 
          width="100%" 
          height="100%" 
          scrolling="no" 
          frameBorder="no" 
          allow="autoplay" 
          src={item.embedUrl}
          className="rounded-lg"
        ></iframe>
      </div>
    );
  }

  // Apple Music embed
  if (item.type.includes('apple-music')) {
    return (
      <div className={item.type === 'apple-music-playlist' ? "h-[450px]" : "h-[175px]"}>
        <iframe 
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
          frameBorder="0" 
          height="100%" 
          width="100%" 
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
          src={item.embedUrl}
          className="rounded-lg"
        ></iframe>
      </div>
    );
  }

  // Default fallback for unsupported media types
  return (
    <div className="flex items-center justify-center bg-transparent min-h-[200px] rounded-lg bg-gray-800/30 p-4">
      <p className="text-cyan-400">Media from {item.embedUrl || "external platform"}</p>
    </div>
  );
};

export function MinimalProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Your Name',
    title: 'Your Title',
    bio: 'Tell your story here...',
    image: ''
  });
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [stickerData, setStickerData] = useState<{ visible: boolean; image: string }>({
    visible: true,
    image: "/images/stickers/daisy-blue.png"
  });
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletStatus, setWalletStatus] = useState('');

  // Default example media items
  const exampleMediaItems = [
    {
      id: '1',
      type: 'youtube',
      title: 'Example YouTube Video',
      embedUrl: 'https://www.youtube.com/embed/coh2TB6B2EA',
      rawUrl: 'https://youtu.be/coh2TB6B2EA'
    },
    {
      id: '2',
      type: 'spotify-playlist',
      title: 'Example Spotify Playlist',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZEVXbMDoHDwVN2tF',
      rawUrl: 'https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF'
    }
  ];

  // Default example shop items
  const exampleShopItems = [
    {
      id: '1',
      title: 'Limited Edition Merch',
      description: 'Exclusive merchandise from the latest tour',
      image: '/images/shop-placeholder.jpg',
      price: '$25.00',
      link: 'https://example.com/merch/limited-edition'
    },
    {
      id: '2',
      title: 'Digital Album',
      description: 'Download my latest album in high quality',
      image: '/images/placeholder.png',
      price: '$9.99',
      link: 'https://example.com/album/digital'
    }
  ];

  // Storage keys
  const STORAGE_KEYS = {
    PROFILE: 'mixmi_profile_data',
    MEDIA: 'mixmi_media_items',
    SHOP: 'mixmi_shop_items',
    STICKER: 'mixmi_sticker_data'
  };

  // Load any saved profile data on mount
  useEffect(() => {
    try {
      // Try to load profile data from localStorage
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileData({
          name: parsed.name || 'Your Name',
          title: parsed.title || 'Your Title',
          bio: parsed.bio || 'Tell your story here...',
          image: parsed.image || ''
        });
        
        // Also load sticker data if it exists in the profile
        if (parsed.sticker) {
          setStickerData(parsed.sticker);
        }
        
        console.log('Loaded profile from localStorage');
      }

      // Also try to load standalone sticker data (some versions store it separately)
      const savedSticker = localStorage.getItem(STORAGE_KEYS.STICKER);
      if (savedSticker) {
        const parsed = JSON.parse(savedSticker);
        if (parsed && parsed.image) {
          setStickerData(parsed);
          console.log('Loaded sticker data from localStorage');
        }
      }

      // Load media items
      const savedMedia = localStorage.getItem(STORAGE_KEYS.MEDIA);
      if (savedMedia) {
        const parsed = JSON.parse(savedMedia);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMediaItems(parsed);
          console.log('Loaded media items from localStorage:', parsed.length);
        } else {
          setMediaItems(exampleMediaItems);
          console.log('No media items found in localStorage, using example items');
        }
      } else {
        setMediaItems(exampleMediaItems);
        console.log('No media items in localStorage, using example items');
      }
      
      // Load shop items
      const savedShop = localStorage.getItem(STORAGE_KEYS.SHOP);
      if (savedShop) {
        const parsed = JSON.parse(savedShop);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setShopItems(parsed);
          console.log('Loaded shop items from localStorage:', parsed.length);
        } else {
          setShopItems(exampleShopItems);
          console.log('No shop items found in localStorage, using example items');
        }
      } else {
        setShopItems(exampleShopItems);
        console.log('No shop items in localStorage, using example items');
      }

      // Check for wallet connection
      const connected = localStorage.getItem('simple-wallet-connected') === 'true';
      const address = localStorage.getItem('simple-wallet-address');
      
      if (connected && address) {
        setIsWalletConnected(true);
        setWalletAddress(address);
        console.log('Restored wallet connection:', address);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Simple wallet connection function
  const handleConnectWallet = async () => {
    if (isWalletConnected) {
      // Handle disconnect
      localStorage.removeItem('simple-wallet-connected');
      localStorage.removeItem('simple-wallet-address');
      setIsWalletConnected(false);
      setWalletAddress('');
      setWalletStatus('Wallet disconnected');
      setTimeout(() => setWalletStatus(''), 3000);
      return;
    }

    try {
      setIsLoading(true);
      setWalletStatus('Connecting wallet...');

      // Import needed dependencies
      const { showConnect, AppConfig, UserSession } = await import('@stacks/connect');
      
      // Setup app configuration and user session
      const appConfig = new AppConfig(['store_write']);
      const userSession = new UserSession({ appConfig });
      
      showConnect({
        appDetails: {
          name: 'Mixmi',
          icon: '/favicon.ico',
        },
        redirectTo: window.location.origin,
        onFinish: () => {
          try {
            if (userSession.isUserSignedIn()) {
              const userData = userSession.loadUserData();
              const address = userData.profile.stxAddress.mainnet;
              
              setIsWalletConnected(true);
              setWalletAddress(address);
              setWalletStatus(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
              
              localStorage.setItem('simple-wallet-connected', 'true');
              localStorage.setItem('simple-wallet-address', address);
              
              setTimeout(() => setWalletStatus(''), 5000);
            } else {
              setWalletStatus('Connection completed but not signed in');
              setTimeout(() => setWalletStatus(''), 3000);
            }
          } catch (error) {
            console.error('Error in onFinish handler:', error);
            setWalletStatus('Error processing connection');
            setTimeout(() => setWalletStatus(''), 3000);
          } finally {
            setIsLoading(false);
          }
        },
        userSession,
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setWalletStatus(`Error: ${error.message || 'Unknown error'}`);
      setTimeout(() => setWalletStatus(''), 5000);
      setIsLoading(false);
    }
  };

  // Escape hatch for stuck loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Safety timeout triggered: forcing loading state to complete");
        setIsLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
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
              onClick={handleConnectWallet}
              disabled={isLoading}
              className={`px-4 py-2 rounded text-white ${
                isWalletConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </span>
              ) : (
                <span>{isWalletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}</span>
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
      
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          {/* User Profile */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image - left side */}
              <div className="flex-shrink-0">
                <div className="w-60 h-60 rounded-lg overflow-hidden border-2 border-cyan-600 bg-gray-800 flex items-center justify-center">
                  {profileData.image ? (
                    <img
                      src={profileData.image}
                      alt={profileData.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <div className="text-5xl mb-2">👤</div>
                      <div className="text-xs">No Image</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Profile info - text aligned left on desktop, centered on mobile */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-cyan-300">{profileData.name}</h1>
                <p className="text-xl text-gray-300 mb-4">{profileData.title}</p>
                
                <div className="max-w-2xl">
                  <p className="text-gray-300 mb-6 text-base">{profileData.bio}</p>
                </div>
                
                {/* Social links would go here */}
                
                {isWalletConnected && (
                  <div className="flex md:justify-start justify-center items-center mt-4 text-sm text-gray-400">
                    <span className="mr-2">Wallet:</span>
                    <span className="bg-gray-800 rounded px-3 py-1 font-mono">
                      {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Spotlight Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-8">SPOTLIGHT</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="aspect-square relative bg-gray-700">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={`/images/${item === 1 ? 'featured-artist-placeholder.jpg' : 
                               item === 2 ? 'next-event-placeholder.jpg' : 
                               'latest-project-placeholder.jpg'}`}
                        alt="Placeholder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-1">
                      {item === 1 ? 'Latest Release' : 
                       item === 2 ? 'Upcoming Shows' : 
                       'New Collaboration'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {item === 1 ? 'Check out my new track' : 
                       item === 2 ? 'See where I\'m performing next' : 
                       'A special project with amazing artists'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Media Section */}
          {mediaItems && mediaItems.length > 0 && (
            <div className="mt-24 mb-24 max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-8 tracking-wider">
                MEDIA
              </h2>
              <p className="text-sm text-gray-400 text-center mb-12">
                Music, videos, DJ mixes, and playlists
              </p>
              
              {mediaItems.length === 1 ? (
                // Single media item - centered with constrained width
                <div className="flex justify-center">
                  <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-lg overflow-hidden">
                    <div className="w-full">
                      <MediaEmbed item={mediaItems[0]} />
                    </div>
                    {mediaItems[0].title && (
                      <div className="py-3">
                        <h3 className="text-xl font-medium text-white">{mediaItems[0].title}</h3>
                      </div>
                    )}
                  </div>
                </div>
              ) : mediaItems.length === 2 ? (
                // Two media items - centered with constrained width
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  {mediaItems.slice(0, 2).map((item, index) => (
                    <div key={index} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-lg overflow-hidden">
                      <div className="w-full">
                        <MediaEmbed item={item} />
                      </div>
                      {item.title && (
                        <div className="py-3">
                          <h3 className="text-xl font-medium text-white">{item.title}</h3>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // 3+ items - grid layout
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaItems.slice(0, 6).map((item, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <div className="w-full">
                        <MediaEmbed item={item} />
                      </div>
                      {item.title && (
                        <div className="py-3">
                          <h3 className="text-xl font-medium text-white">{item.title}</h3>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Shop Section */}
          {shopItems && shopItems.length > 0 && (
            <div className="mt-24 mb-24 max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-8 tracking-wider">
                SHOP
              </h2>
              <p className="text-sm text-gray-400 text-center mb-12">
                Connect visitors to your shop and products
              </p>
              
              {shopItems.length < 3 ? (
                // 1-2 items - center justified with fixed width
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  {shopItems.map((item, index) => (
                    <div key={index} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                      <div className="bg-gray-800 rounded-lg overflow-hidden h-full">
                        <div className="aspect-square relative bg-gray-700">
                          <img 
                            src={item.image || "/images/shop-placeholder.jpg"}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          
                          {/* Price badge */}
                          {item.price && (
                            <div className="absolute top-2 right-2 bg-cyan-600 text-white px-2 py-1 rounded text-sm font-bold">
                              {item.price}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-medium mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">
                            {item.description}
                          </p>
                          {item.link && (
                            <a 
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 text-sm hover:underline inline-flex items-center"
                            >
                              View Details
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // 3+ items - grid layout
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shopItems.map((item, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg overflow-hidden h-full">
                      <div className="aspect-square relative bg-gray-700">
                        <img 
                          src={item.image || "/images/shop-placeholder.jpg"}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Price badge */}
                        {item.price && (
                          <div className="absolute top-2 right-2 bg-cyan-600 text-white px-2 py-1 rounded text-sm font-bold">
                            {item.price}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {item.description}
                        </p>
                        {item.link && (
                          <a 
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 text-sm hover:underline inline-flex items-center"
                          >
                            View Details
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Sticker Display - position at the bottom of the content, not fixed */}
          <StickerDisplay sticker={stickerData} />
          
          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-12">
            <Link href="/integrated" className="px-4 py-2 bg-gray-800 rounded">
              Integrated Profile
            </Link>
            <Link href="/simple" className="px-4 py-2 bg-gray-800 rounded">
              Simple Profile
            </Link>
            <Link href="/" className="px-4 py-2 bg-cyan-700 rounded">
              Main Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 