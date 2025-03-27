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
import { MediaItem } from '@/types/media';
import { SpotlightItem as SpotlightItemType, ShopItem as ShopItemType } from '@/types';
import StickerDisplay from './StickDisplay';
import PersonalInfoSection from './PersonalInfoSection';
import { SectionVisibilityManager } from '../ui/section-visibility-manager';
import { Card, CardContent } from '../ui/card';
import { HoverControls, EditButtonControl } from '../ui/hover-controls';
import { SpotlightEditorModal } from './editor/modals/SpotlightEditorModal';
import { MediaEditorModal } from './editor/modals/MediaEditorModal';
import { ShopEditorModal } from './editor/modals/ShopEditorModal';
import { StickerEditorModal } from './editor/modals/StickerEditorModal';

// Media embed component for rendering different types of media
const MediaEmbed = ({ item }: { item: MediaItem }) => {
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

  // Mixcloud embed
  if (item.type === 'mixcloud') {
    return (
      <div className="h-[180px]">
        <iframe 
          width="100%" 
          height="100%" 
          src={item.embedUrl}
          frameBorder="0"
          allow="autoplay"
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
  mediaItems: MediaItem[];
  spotlightItems: SpotlightItemType[];
  shopItems: ShopItemType[];
  isAuthenticated?: boolean;
  isTransitioning?: boolean;
  onEditProfile?: () => void;
  onUpdateProfile?: (field: keyof ProfileData | 'profileInfo', value: any) => void;
  onUpdateSpotlightItems?: (items: SpotlightItemType[]) => void;
  onUpdateMediaItems?: (items: MediaItem[]) => void;
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
  mediaItems,
  spotlightItems,
  shopItems,
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
  // Use useEffect to handle client-side-only state changes
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effective auth state that considers both isAuthenticated and transition state
  const effectiveAuth = isAuthenticated && !isTransitioning;
  
  // State to track which spotlight item is being edited
  const [editingSpotlightId, setEditingSpotlightId] = useState<string | null>(null);

  // Add state for spotlight editor modal
  const [isSpotlightEditorOpen, setIsSpotlightEditorOpen] = useState(false);

  // Add state for media editor modal
  const [isMediaEditorOpen, setIsMediaEditorOpen] = useState(false);

  // Add state for shop editor modal
  const [isShopEditorOpen, setIsShopEditorOpen] = useState(false);

  // Add state for sticker editor modal
  const [isStickerEditorOpen, setIsStickerEditorOpen] = useState(false);

  // For debugging
  const handleEditClick = useCallback(() => {
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
  }, [onEditProfile, effectiveAuth]);

  // Debug authentication state
  useEffect(() => {
    console.log('ProfileView full auth state:', {
      isAuthenticated,
      effectiveAuth,
      isDev: process.env.NODE_ENV === 'development',
      onEditProfile: !!onEditProfile
    });
  }, [isAuthenticated, effectiveAuth, process.env.NODE_ENV, onEditProfile]);

  // Debug authentication state
  useEffect(() => {
    console.log('ProfileView auth state:', {
      isAuthenticated,
      effectiveAuth,
      isDev: process.env.NODE_ENV === 'development'
    });
  }, [isAuthenticated, effectiveAuth, process.env.NODE_ENV]);

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

  // Add before the return statement
  const handleMediaUpdate = (updatedItems: MediaItem[]) => {
    onUpdateMediaItems?.(updatedItems);
    setIsMediaEditorOpen(false);
  };

  const handleShopUpdate = (updatedItems: ShopItemType[]) => {
    onUpdateShopItems?.(updatedItems);
    setIsShopEditorOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <MediaEditorModal
        isOpen={isMediaEditorOpen}
        onClose={() => setIsMediaEditorOpen(false)}
        items={mediaItems}
        onSave={handleMediaUpdate}
      />
      <ShopEditorModal
        isOpen={isShopEditorOpen}
        onClose={() => setIsShopEditorOpen(false)}
        items={shopItems}
        onSave={handleShopUpdate}
      />
      
      <div className="relative min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          {/* Profile Section */}
          <PersonalInfoSection
            profile={profile}
            isAuthenticated={effectiveAuth}
            onUpdateProfile={onUpdateProfile}
          />
          
          {/* Section Visibility Controls - Only visible when authenticated */}
          {mounted && effectiveAuth && onUpdateSectionVisibility ? (
            <div className="max-w-sm ml-4 lg:ml-auto lg:mr-auto mb-8">
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
            <div className="max-w-sm ml-4 lg:ml-auto lg:mr-auto mb-8 h-12"></div>
          )}

          {/* Spotlight Section */}
          {(profile.sectionVisibility?.spotlight !== false) && (
            <div className="mt-16 mb-16">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl font-bold text-white tracking-wider">
                    SPOTLIGHT
                  </h2>
                  {mounted && effectiveAuth && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSpotlightEditorOpen(true)}
                      className="text-cyan-400 border-cyan-800 hover:bg-cyan-900/40 hover:text-cyan-300 hover:border-cyan-600"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Section
                    </Button>
                  )}
                </div>
                {mounted && effectiveAuth && (
                  <p className="text-sm text-gray-400 mb-12">
                    Share your work and favorite projects
                  </p>
                )}
                {(!mounted || !effectiveAuth) && <div className="mb-8"></div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spotlightItems.length > 0 ? (
                    // Render actual spotlight items
                    spotlightItems.map((item, index) => (
                      <div 
                        key={item.id}
                        className="group relative rounded-lg overflow-hidden bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                      >
                        <div className="aspect-square relative">
                          {item.image ? (
                            item.image.startsWith('data:') ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="absolute w-full h-full object-cover"
                                style={{ imageRendering: 'auto' }}
                              />
                            ) : (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                              />
                            )
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                              <p className="text-gray-500">No image</p>
                            </div>
                          )}
                          
                          {/* Edit button for authenticated users */}
                          {mounted && effectiveAuth && (
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-black/50 hover:bg-black/70 border-gray-600"
                                onClick={() => setIsSpotlightEditorOpen(true)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          
                          {/* Corner badge */}
                          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                            max-w-[90%] md:max-w-[80%] transition-all duration-300 
                            md:group-hover:max-w-full rounded-tr-md">
                            <div className="border-l-2 border-cyan-400 pl-2">
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="group/title">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-white text-sm font-medium truncate group-hover/title:underline">
                                    {item.title}
                                  </h4>
                                </div>
                              </a>
                              <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : mounted && effectiveAuth ? (
                    // Render placeholder content when authenticated but no items
                    <>
                      {[
                        {
                          image: '/images/next-event-placeholder.jpg',
                          title: 'Your Next Event',
                          description: 'Share details about your upcoming shows, releases, or collaborations'
                        },
                        {
                          image: '/images/featured-artist-placeholder.jpg',
                          title: 'Featured Artist',
                          description: 'Highlight collaborations and share the spotlight with other artists'
                        },
                        {
                          image: '/images/latest-project-placeholder.jpg',
                          title: 'Latest Project',
                          description: 'Share your latest music, art, or creative projects'
                        }
                      ].map((placeholder, index) => (
                        <div key={index} className="group relative rounded-lg overflow-hidden bg-gray-800/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                             onClick={() => {
                               if (onEditProfile) {
                                 onEditProfile();
                               }
                             }}>
                          <div className="aspect-square relative">
                            <Image
                              src={placeholder.image}
                              alt={placeholder.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover opacity-60"
                              priority
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button 
                                variant="outline" 
                                className="border-cyan-500 text-cyan-300 hover:bg-cyan-950/50"
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Add Content
                              </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                              max-w-[90%] md:max-w-[80%] transition-all duration-300 
                              md:group-hover:max-w-full rounded-tr-md">
                              <div className="border-l-2 border-cyan-400 pl-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-white text-sm font-medium truncate">{placeholder.title}</h4>
                                </div>
                                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                                  {placeholder.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Add the SpotlightEditorModal */}
          <SpotlightEditorModal
            isOpen={isSpotlightEditorOpen}
            onClose={() => setIsSpotlightEditorOpen(false)}
            items={spotlightItems}
            onSave={(updatedItems) => {
              if (onUpdateSpotlightItems) {
                onUpdateSpotlightItems(updatedItems);
              }
            }}
          />

          {/* Media Section */}
          {(profile.sectionVisibility?.media !== false) && mediaItems.length > 0 && (
            <div className="mt-24 sm:mt-32 mb-24 opacity-0 animate-fadeIn"
                 style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl font-bold text-white tracking-wider">
                    MEDIA
                  </h2>
                  {effectiveAuth && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsMediaEditorOpen(true)}
                      className="text-cyan-400 border-cyan-800 hover:bg-cyan-900/40 hover:text-cyan-300 hover:border-cyan-600"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Section
                    </Button>
                  )}
                </div>
                {effectiveAuth && (
                  <p className="text-sm text-gray-400 mb-12">
                    Share your music, DJ mixes, playlists and videos
                  </p>
                )}
                {!effectiveAuth && <div className="mb-8"></div>}
                
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
                  ) : (
                    // Two or three media items - grid layout
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mediaItems.map((item, index) => (
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
                ) : null}
              </div>
            </div>
          )}

          {/* Shop Section */}
          {(profile.sectionVisibility?.shop !== false) && shopItems.length > 0 && (
            <div className="mt-24 sm:mt-32 mb-24 opacity-0 animate-fadeIn"
                 style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl font-bold text-white tracking-wider">
                    SHOP
                  </h2>
                  {effectiveAuth && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsShopEditorOpen(true)}
                      className="text-cyan-400 border-cyan-800 hover:bg-cyan-900/40 hover:text-cyan-300 hover:border-cyan-600"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Section
                    </Button>
                  )}
                </div>
                {effectiveAuth && (
                  <p className="text-sm text-gray-400 mb-12">
                    Share anything you want to sell - physical products, digital downloads, or Web3 experiences
                  </p>
                )}
                {!effectiveAuth && <div className="mb-8"></div>}
                
                {shopItems && shopItems.length > 0 ? (
                  <>
                    {shopItems.length < 3 ? (
                      // 1-2 items - center justified 
                      <div className="flex flex-col sm:flex-row justify-center gap-6">
                        {shopItems.slice(0, 3).map((item, index) => (
                          <div 
                            key={index}
                            className="group block relative rounded-lg overflow-hidden w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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
                                    priority
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
                            className="group block relative rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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
                                    priority
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
                    <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] relative rounded-lg overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
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
            </div>
          )}
          
          {/* Sticker display */}
          <div className="relative group">
            <StickerDisplay 
              sticker={profile.sticker} 
              sectionVisibility={profile.sectionVisibility}
            />
            {mounted && effectiveAuth && onUpdateStickerData && (
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsStickerEditorOpen(true)}
                  className="text-cyan-400 border-cyan-800 hover:bg-cyan-900/40 hover:text-cyan-300 hover:border-cyan-600"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Sticker
                </Button>
              </div>
            )}
          </div>

          {/* Add the StickerEditorModal */}
          <StickerEditorModal
            isOpen={isStickerEditorOpen}
            onClose={() => setIsStickerEditorOpen(false)}
            sticker={profile.sticker || { visible: true, image: '/images/stickers/daisy-blue.png' }}
            onSave={(updatedSticker) => {
              if (onUpdateStickerData) {
                onUpdateStickerData(updatedSticker);
              }
              setIsStickerEditorOpen(false);
            }}
          />

          {effectiveAuth && onEditProfile && (
            <div className="mt-4">
              <button
                onClick={handleEditClick}
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
      </div>
    </div>
  );
};

export default ProfileView; 