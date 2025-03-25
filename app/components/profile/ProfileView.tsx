/** @jsxImportSource react */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
import { ProfileData } from '@/types';
import { MediaItem as MediaItemType, SpotlightItem as SpotlightItemType, ShopItem as ShopItemType } from '@/types';
import StickerDisplay from './StickDisplay';
import PersonalInfoSection from './PersonalInfoSection';
import { SectionVisibilityManager } from '../ui/section-visibility-manager';
import { Card, CardContent } from '../ui/card';

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
  // New props for edit-in-place functionality
  onUpdateProfile?: (field: keyof ProfileData, value: any) => void;
  onUpdateSpotlightItems?: (items: SpotlightItemType[]) => void;
  onUpdateMediaItems?: (items: MediaItemType[]) => void;
  onUpdateShopItems?: (items: ShopItemType[]) => void;
  onUpdateStickerData?: (data: { visible: boolean; image: string }) => void;
  onUpdateSectionVisibility?: (field: keyof ProfileData['sectionVisibility'], value: boolean) => void;
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
  onEditProfile,
  onUpdateProfile,
  onUpdateSpotlightItems,
  onUpdateMediaItems,
  onUpdateShopItems,
  onUpdateStickerData,
  onUpdateSectionVisibility
}) => {
  // For development, enable editing by default
  const isDev = process.env.NODE_ENV === 'development';
  
  // Authentication handling - no longer rely on devForceAuth
  const [devForceAuth, setDevForceAuth] = useState(false);
  
  // Use either real auth or dev-forced auth
  const effectiveAuth = isAuthenticated;
  
  // Debug authentication state
  useEffect(() => {
    console.log('ProfileView full auth state:', {
      isAuthenticated,
      effectiveAuth,
      devForceAuth,
      isDev,
      onEditProfile: !!onEditProfile
    });
  }, [isAuthenticated, effectiveAuth, devForceAuth, isDev, onEditProfile]);

  // Debug authentication state
  useEffect(() => {
    console.log('ProfileView auth state:', {
      isAuthenticated,
      effectiveAuth,
      devForceAuth,
      isDev
    });
  }, [isAuthenticated, effectiveAuth, devForceAuth, isDev]);

  // Debug tracking for UI elements
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

  const handleEditProfile = useCallback(() => {
    console.log('📝 Edit profile clicked:', {
      isAuthenticated,
      effectiveAuth,
      hasEditCallback: !!onEditProfile
    });
    
    // Call the parent's edit callback if provided
    if (onEditProfile) {
      onEditProfile();
    }
  }, [onEditProfile, isAuthenticated, effectiveAuth]);

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Profile Section */}
      <PersonalInfoSection
        profile={profile}
        isAuthenticated={effectiveAuth}
        onUpdateProfile={onUpdateProfile}
      />
      
      {/* Section Visibility Controls - Only visible when authenticated */}
      {effectiveAuth && onUpdateSectionVisibility ? (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <SectionVisibilityManager
            visibility={profile.sectionVisibility || {}}
            onVisibilityChange={(field, value) => {
              if (onUpdateSectionVisibility) {
                onUpdateSectionVisibility(field as keyof ProfileData['sectionVisibility'], value);
              }
            }}
            isAuthenticated={effectiveAuth}
          />
        </div>
      ) : (
        // Placeholder div to maintain consistent spacing when section manager is not visible
        <div className="max-w-4xl mx-auto px-4 mb-8 h-14"></div>
      )}

      {/* Spotlight Section */}
      {(profile.sectionVisibility?.spotlight !== false) && spotlightItems.length > 0 && (
        <div className="mt-16 mb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-4 tracking-wider">
              SPOTLIGHT
            </h2>
            {!profile.hasEditedProfile && (
              <p className="text-sm text-gray-400 text-center mb-12">
                Share your work and favorite projects
              </p>
            )}
            {profile.hasEditedProfile && <div className="mb-12"></div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spotlightItems.map((item) => (
                <div key={item.id} className="flex justify-center">
                  <Card className="w-full overflow-hidden group max-w-md">
                    <CardContent className="p-0">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="relative aspect-square w-full bg-gray-800">
                          <Image
                            src={item.image || '/images/next-event-placeholder.jpg'}
                            alt={item.title || 'Spotlight image'}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                          
                          {/* Corner badge with title */}
                          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                            max-w-[90%] md:max-w-[80%] transition-all duration-300 
                            md:group-hover:max-w-full rounded-tr-md">
                            <div className="border-l-2 border-cyan-400 pl-2">
                              <div className="flex items-center gap-2">
                                <h4 className="text-white text-sm font-medium truncate">{item.title || "Untitled"}</h4>
                              </div>
                              <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
      
      {/* Sticker display - now positioned after the shop section */}
      <StickerDisplay sticker={profile.sticker} />

      {effectiveAuth && onEditProfile && (
        <div className="mt-4">
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 bg-transparent border border-cyan-500 text-cyan-300 rounded-md hover:bg-cyan-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile (View)</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileView; 