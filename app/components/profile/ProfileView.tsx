/** @jsxImportSource react */
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { 
  Edit2, 
  ExternalLink,
  Instagram,
  Copy
} from 'lucide-react';
// Import brand icons from React Icons
import { FaYoutube, FaSpotify, FaSoundcloud, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiTiktok } from 'react-icons/si';
import { ProfileData, MediaItemType, SpotlightItemType, ShopItemType } from './UserProfileContainer';

// Media embed component for rendering different types of media
const MediaEmbed = ({ item }: { item: MediaItemType }) => {
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

interface ProfileViewProps {
  profile: ProfileData;
  mediaItems: MediaItemType[];
  spotlightItems: SpotlightItemType[];
  shopItems: ShopItemType[];
  isAuthenticated?: boolean;
  isTransitioning?: boolean;
  onEditProfile?: () => void;
}

// Inline styles for the rotation animation
const rotationStyle = `
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes daisy-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .animate-daisy-rotate {
    animation: daisy-rotate 10s linear infinite;
    transform-origin: center;
  }
`;

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  mediaItems = [],
  spotlightItems = [],
  shopItems = [],
  isAuthenticated = false,
  isTransitioning = false,
  onEditProfile
}) => {
  // For development, enable editing by default
  const isDev = process.env.NODE_ENV === 'development';
  
  // Authentication handling
  const [devForceAuth, setDevForceAuth] = useState(() => {
    // In development mode, let's default to being able to edit
    return isDev;
  });
  
  // Use either real auth or dev-forced auth
  const effectiveAuth = devForceAuth || isAuthenticated;

  // Debug logging
  useEffect(() => {
    if (isDev) {
      console.log('ProfileView debug:', {
        isAuthenticated,
        devForceAuth,
        effectiveAuth,
        hasEditCallback: !!onEditProfile
      });
    }
  }, [isAuthenticated, devForceAuth, effectiveAuth, onEditProfile, isDev]);

  // Helper function to return the appropriate icon for each social platform
  const getSocialIcon = (platform: string) => {
    const iconSize = 18;
    const iconStyle = { color: '#e4e4e7' }; // Softer white color (gray-200 equivalent)
    
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <FaYoutube size={iconSize} style={iconStyle} />;
      case 'instagram':
        return <Instagram size={iconSize} className="text-gray-200" />;
      case 'twitter':
        return <FaXTwitter size={iconSize} style={iconStyle} />;
      case 'linkedin':
        return <FaLinkedinIn size={iconSize} style={iconStyle} />;
      case 'spotify':
        return <FaSpotify size={iconSize} style={iconStyle} />;
      case 'soundcloud':
        return <FaSoundcloud size={iconSize} style={iconStyle} />;
      case 'tiktok':
        return <SiTiktok size={iconSize} style={iconStyle} />;
      default:
        return <span className="text-xs text-gray-200">{platform && platform.length > 0 ? platform[0].toUpperCase() : '?'}</span>;
    }
  };

  // Dev mode toggle - only in development
  const DevControls = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    // Local state to track if debug is enabled
    const [debugEnabled, setDebugEnabled] = React.useState(false);
    
    // Function to toggle auth debugging
    const toggleDebug = () => {
      if (typeof window !== 'undefined') {
        const newState = !(window as any).DEBUG_AUTH;
        (window as any).DEBUG_AUTH = newState;
        setDebugEnabled(newState);
        console.log(`Auth debugging ${newState ? 'enabled' : 'disabled'}`);
      }
    };
    
    return (
      <div className="fixed top-20 right-4 bg-black/80 p-3 rounded z-50 text-xs">
        <h3 className="font-bold text-white mb-2">Dev Controls</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-300">Force Auth:</span>
          <button
            onClick={() => setDevForceAuth(!devForceAuth)}
            className={`px-2 py-1 rounded ${devForceAuth ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {devForceAuth ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-300">Debug Mode:</span>
          <button
            onClick={toggleDebug}
            className={`px-2 py-1 rounded ${debugEnabled ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {debugEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="text-gray-400 text-[10px]">
          Auth State: {effectiveAuth ? 'Authenticated' : 'Not Authenticated'}
        </div>
      </div>
    );
  };

  // For debugging
  const handleEditClick = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🖋️ Edit profile clicked:', {
        isAuthenticated: effectiveAuth,
        hasCallback: !!onEditProfile
      });
    }
    
    if (onEditProfile) {
      onEditProfile();
    } else {
      console.warn('Edit profile clicked but no callback provided!');
    }
  };

  // Enhanced edit button display logic
  const renderEditButton = () => {
    const showEditButton = effectiveAuth || isDev;
    
    if (!showEditButton) return null;
    
    return (
      <div className="mt-6">
        <Button 
          onClick={handleEditClick}
          variant="outline"
          className="border-gray-600 text-cyan-300 hover:bg-gray-800 hover:text-cyan-200 transition-colors"
        >
          <Edit2 className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="container mx-auto p-4 sm:p-8 md:p-12 lg:p-16">
          {/* Profile section */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 opacity-0 animate-fadeIn"
               style={{ animationFillMode: 'forwards' }}>
            {/* Left column - Profile image */}
            <div className="w-full lg:w-[40%] max-w-md mx-auto lg:mx-0">
              <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-cyan-600">
                {profile.image && profile.image.startsWith('data:') ? (
                  <img
                    src={profile.image}
                    alt="Profile photo"
                    className="absolute w-full h-full object-cover"
                    style={{ imageRendering: 'auto' }}
                  />
                ) : (
                  <Image
                    src={profile.image || '/images/placeholder.png'}
                    alt="Profile photo"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>

            {/* Right column - Profile info */}
            <div className="w-full lg:w-[60%] flex flex-col items-center justify-center text-center lg:h-full">
              <div className="space-y-6 w-full max-w-xl">
                {/* Name and Title */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300">
                    {profile.name}
                  </h1>
                  <h2 className="text-lg sm:text-xl text-gray-200">
                    {profile.title}
                  </h2>
                </div>

                {/* Bio */}
                <div>
                  <p className="text-sm sm:text-base text-gray-300 whitespace-pre-wrap break-words">
                    {profile.bio}
                  </p>
                </div>

                {/* Social Links */}
                {profile.socialLinks && profile.socialLinks.length > 0 && (
                  <div className="flex justify-center gap-4 flex-wrap">
                    {profile.socialLinks.map((link, index) => (
                      <a 
                        key={index} 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                        title={link.platform}
                      >
                        {getSocialIcon(link.platform)}
                      </a>
                    ))}
                  </div>
                )}

                {/* Wallet Address */}
                {profile.showWalletAddress && profile.walletAddress && (
                  <div className="p-3 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-mono text-gray-400 truncate max-w-[200px] sm:max-w-[300px]">
                        {profile.walletAddress}
                      </span>
                      <button 
                        onClick={() => {
                          if (profile.walletAddress) {
                            navigator.clipboard.writeText(profile.walletAddress);
                          }
                        }}
                        className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                        title="Copy wallet address"
                      >
                        <Copy className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit Profile button */}
                {renderEditButton()}
              </div>
            </div>
          </div>
          
          {/* Spotlight Section Debug */}
          <div className="bg-pink-500 text-white p-2 text-xs m-2 rounded">
            <h4>Debug: Spotlight Section</h4>
            <p>Visibility: {String(profile.sectionVisibility?.spotlight !== false)}</p>
            <p>Items: {spotlightItems.length}</p>
            <p>Should render: {String((profile.sectionVisibility?.spotlight !== false) && spotlightItems.length > 0)}</p>
          </div>

          {/* Spotlight Section */}
          {(profile.sectionVisibility?.spotlight !== false) && spotlightItems.length > 0 && (
            <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
                 style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
              <h2 className="text-4xl font-bold text-white text-center mb-4 tracking-wider">
                SPOTLIGHT
              </h2>
              {!profile.hasEditedProfile && (
                <p className="text-sm text-gray-400 text-center mb-12">
                  Share your work and favorite projects
                </p>
              )}
              {profile.hasEditedProfile && <div className="mb-12"></div>}
              
              {/* Add debugging info for spotlight items */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-2 bg-gray-800 text-xs text-gray-300 rounded">
                  <p>Debug: {spotlightItems?.length || 0} spotlight items</p>
                  <p>Filtered items: {spotlightItems?.filter(item => item.title.trim() || item.description.trim()).length || 0}</p>
                  <pre className="overflow-auto max-h-20">{JSON.stringify(spotlightItems, null, 2)}</pre>
                </div>
              )}
              
              {spotlightItems && spotlightItems.filter(item => item.title.trim() || item.description.trim()).length > 0 ? (
                spotlightItems.filter(item => item.title.trim() || item.description.trim()).length < 3 ? (
                  // 1-2 items - center justified
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                    {spotlightItems
                      .filter(item => item.title.trim() || item.description.trim())
                      .slice(0, 3)
                      .map((item, index) => (
                        <div 
                          key={index}
                          className="group block relative rounded-lg overflow-hidden w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                        >
                          <div className="aspect-square relative bg-gray-800">
                            {item.image ? (
                              item.image.startsWith('data:') ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="absolute w-full h-full object-cover"
                                  style={{ imageRendering: 'auto' }} // Ensures GIFs animate properly
                                />
                              ) : (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              )
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <p className="text-gray-500">No image</p>
                              </div>
                            )}
                            
                            {/* Corner badge - similar to the editor but optimized for viewing */}
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                              max-w-[90%] md:max-w-[80%] transition-all duration-300 
                              md:group-hover:max-w-full rounded-tr-md">
                              <div className="border-l-2 border-cyan-400 pl-2">
                                {item.link ? (
                                  <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group/title"
                                  >
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-white text-sm font-medium truncate group-hover/title:underline">{item.title || "Untitled"}</h4>
                                    </div>
                                  </a>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-white text-sm font-medium truncate">{item.title || "Untitled"}</h4>
                                  </div>
                                )}
                                <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  // 3 items - grid layout
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spotlightItems
                      .filter(item => item.title.trim() || item.description.trim())
                      .slice(0, 3)
                      .map((item, index) => (
                        <div 
                          key={index}
                          className="group block relative rounded-lg overflow-hidden"
                        >
                          <div className="aspect-square relative bg-gray-800">
                            {item.image ? (
                              item.image.startsWith('data:') ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="absolute w-full h-full object-cover"
                                  style={{ imageRendering: 'auto' }} // Ensures GIFs animate properly
                                />
                              ) : (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              )
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <p className="text-gray-500">No image</p>
                              </div>
                            )}
                            
                            {/* Corner badge - similar to the editor but optimized for viewing */}
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                              max-w-[90%] md:max-w-[80%] transition-all duration-300 
                              md:group-hover:max-w-full rounded-tr-md">
                              <div className="border-l-2 border-cyan-400 pl-2">
                                {item.link ? (
                                  <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group/title"
                                  >
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-white text-sm font-medium truncate group-hover/title:underline">{item.title || "Untitled"}</h4>
                                    </div>
                                  </a>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-white text-sm font-medium truncate">{item.title || "Untitled"}</h4>
                                  </div>
                                )}
                                <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Example cards showing what you can do with Spotlight */}
                  <div className="relative rounded-lg overflow-hidden group">
                    <div className="aspect-square relative bg-gray-800/50">
                      <Image
                        src="/images/next-event-placeholder.jpg"
                        alt="Event example"
                        fill
                        className="object-cover"
                      />
                      
                      {/* Corner badge */}
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                        max-w-[90%] md:max-w-[80%] transition-all duration-300 
                        md:group-hover:max-w-full rounded-tr-md">
                        <div className="border-l-2 border-cyan-400 pl-2">
                          <a href="#" className="group/title">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white text-sm font-medium truncate group-hover/title:underline">Your Next Event</h4>
                            </div>
                          </a>
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">
                            Share details about your upcoming shows, releases, or collaborations
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative rounded-lg overflow-hidden group">
                    <div className="aspect-square relative bg-gray-800/50">
                      <Image
                        src="/images/featured-artist-placeholder.jpg"
                        alt="Featured artist example"
                        fill
                        className="object-cover"
                      />
                      
                      {/* Corner badge */}
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                        max-w-[90%] md:max-w-[80%] transition-all duration-300 
                        md:group-hover:max-w-full rounded-tr-md">
                        <div className="border-l-2 border-cyan-400 pl-2">
                          <a href="#" className="group/title">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white text-sm font-medium truncate group-hover/title:underline">Featured Artist</h4>
                            </div>
                          </a>
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">
                            Highlight creators and collaborators you want to support
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative rounded-lg overflow-hidden group">
                    <div className="aspect-square relative bg-gray-800/50">
                      <Image
                        src="/images/latest-project-placeholder.jpg"
                        alt="Project example"
                        fill
                        className="object-cover"
                      />
                      
                      {/* Corner badge */}
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                        max-w-[90%] md:max-w-[80%] transition-all duration-300 
                        md:group-hover:max-w-full rounded-tr-md">
                        <div className="border-l-2 border-cyan-400 pl-2">
                          <a href="#" className="group/title">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white text-sm font-medium truncate group-hover/title:underline">Latest Project</h4>
                            </div>
                          </a>
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">
                            Showcase your work, ideas, or upcoming releases
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Media Section Debug */}
          <div className="bg-pink-500 text-white p-2 text-xs m-2 rounded">
            <h4>Debug: Media Section</h4>
            <p>Visibility: {String(profile.sectionVisibility?.media !== false)}</p>
            <p>Items: {mediaItems.length}</p>
            <p>Should render: {String((profile.sectionVisibility?.media !== false) && mediaItems.length > 0)}</p>
          </div>

          {/* Media Section */}
          {(profile.sectionVisibility?.media !== false) && mediaItems.length > 0 && (
            <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
                 style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
              <h2 className="text-4xl font-bold text-white text-center mb-4 tracking-wider">
                MEDIA
              </h2>
              {!profile.hasEditedProfile && (
                <p className="text-sm text-gray-400 text-center mb-12">
                  Share your music, videos, DJ mixes, and playlists
                </p>
              )}
              {profile.hasEditedProfile && <div className="mb-12"></div>}
              
              {mediaItems && mediaItems.length > 0 ? (
                mediaItems.length === 1 ? (
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
                  // 3-6 items - grid layout
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
                )
              ) : (
                // Example placeholder media items (2 items) - should be center-justified
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  {/* YouTube Example */}
                  <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-lg overflow-hidden">
                    <div className="w-full bg-transparent">
                      {/* YouTube embed */}
                      <div className="aspect-video">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src="https://www.youtube.com/embed/coh2TB6B2EA" 
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen
                          className="rounded-lg"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                  
                  {/* Spotify Example */}
                  <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-lg overflow-hidden">
                    <div className="w-full bg-transparent">
                      {/* Spotify embed */}
                      <iframe 
                        src="https://open.spotify.com/embed/playlist/37i9dQZEVXbNG2KDcFcKOF?si=O2aB8rkiQqqQhUtBfx8I_g" 
                        width="100%" 
                        height="380" 
                        frameBorder="0" 
                        allow="encrypted-media"
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Shop Section Debug */}
          <div className="bg-pink-500 text-white p-2 text-xs m-2 rounded">
            <h4>Debug: Shop Section</h4>
            <p>Visibility: {String(profile.sectionVisibility?.shop !== false)}</p>
            <p>Items: {shopItems.length}</p>
            <p>Should render: {String((profile.sectionVisibility?.shop !== false) && shopItems.length > 0)}</p>
          </div>

          {/* Shop Section */}
          {(profile.sectionVisibility?.shop !== false) && shopItems.length > 0 && (
            <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
                 style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
              <h2 className="text-4xl font-bold text-white text-center mb-4 tracking-wider">
                SHOP
              </h2>
              {!profile.hasEditedProfile && (
                <p className="text-sm text-gray-400 text-center mb-12">
                  Connect visitors to your shop and products
                </p>
              )}
              {profile.hasEditedProfile && <div className="mb-12"></div>}
              
              {shopItems && shopItems.length > 0 ? (
                <>
                  {/* Add debugging info */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-2 bg-gray-800 text-xs text-gray-300 rounded">
                      <p>Debug: {shopItems.length} shop items</p>
                      <pre className="overflow-auto max-h-20">{JSON.stringify(shopItems, null, 2)}</pre>
                    </div>
                  )}
                  
                  {shopItems.length < 3 ? (
                    // 1-2 items - center justified 
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                      {shopItems.slice(0, 3).map((item, index) => (
                        <div 
                          key={index}
                          className="group block relative rounded-lg overflow-hidden w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                        >
                          <div className="aspect-square relative bg-gray-800">
                            {item.image ? (
                              item.image.startsWith('data:') ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="absolute w-full h-full object-cover"
                                  style={{ imageRendering: 'auto' }} // Ensures GIFs animate properly
                                />
                              ) : (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              )
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <p className="text-gray-500">No image</p>
                              </div>
                            )}
                            
                            {/* Corner badge - similar to the editor but optimized for viewing */}
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                              max-w-[90%] md:max-w-[80%] transition-all duration-300 
                              md:group-hover:max-w-full rounded-tr-md">
                              <div className="border-l-2 border-cyan-400 pl-2">
                                {item.link ? (
                                  <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group/title"
                                  >
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-white text-sm font-medium truncate group-hover/title:underline">{item.title || "Untitled"}</h4>
                                    </div>
                                  </a>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-white text-sm font-medium truncate">{item.title || "Untitled"}</h4>
                                  </div>
                                )}
                                <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">
                                  {item.description}
                                  {item.price && <span className="ml-1 text-cyan-300">{item.price}</span>}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // 3 items - grid layout
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {shopItems.slice(0, 3).map((item, index) => (
                        <div 
                          key={index}
                          className="group block relative rounded-lg overflow-hidden"
                        >
                          {/* Same content as above */}
                          <div className="aspect-square relative bg-gray-800">
                            {item.image ? (
                              item.image.startsWith('data:') ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="absolute w-full h-full object-cover"
                                  style={{ imageRendering: 'auto' }} // Ensures GIFs animate properly
                                />
                              ) : (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              )
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <p className="text-gray-500">No image</p>
                              </div>
                            )}
                            
                            {/* Corner badge - similar to the editor but optimized for viewing */}
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                              max-w-[90%] md:max-w-[80%] transition-all duration-300 
                              md:group-hover:max-w-full rounded-tr-md">
                              <div className="border-l-2 border-cyan-400 pl-2">
                                {item.link ? (
                                  <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group/title"
                                  >
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-white text-sm font-medium truncate group-hover/title:underline">{item.title || "Untitled"}</h4>
                                    </div>
                                  </a>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-white text-sm font-medium truncate">{item.title || "Untitled"}</h4>
                                  </div>
                                )}
                                <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">
                                  {item.description}
                                  {item.price && <span className="ml-1 text-cyan-300">{item.price}</span>}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Shop placeholder - center justified like other sections
                <div className="flex justify-center">
                  <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] relative rounded-lg overflow-hidden group">
                    <div className="aspect-square relative bg-gray-800/50">
                      <Image
                        src="/images/shop-placeholder.jpg"
                        alt="Shop item example"
                        fill
                        className="object-cover"
                      />
                      
                      {/* Corner badge */}
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                        max-w-[90%] md:max-w-[80%] transition-all duration-300 
                        md:group-hover:max-w-full rounded-tr-md">
                        <div className="border-l-2 border-cyan-400 pl-2">
                          <a href="#" className="group/title">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white text-sm font-medium truncate group-hover/title:underline">Exclusive Content</h4>
                            </div>
                          </a>
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">
                            Link to anywhere you sell your stuff, including merch, NFT's or token gated content
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView; 