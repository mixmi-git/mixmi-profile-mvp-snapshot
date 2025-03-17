'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  Edit2, 
  ExternalLink,
  Instagram 
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
  mediaItems,
  spotlightItems,
  shopItems,
  isAuthenticated = false,
  isTransitioning = false,
  onEditProfile,
}) => {
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
        return <span className="text-xs text-gray-200">{platform[0].toUpperCase()}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <style jsx global>{rotationStyle}</style>
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
                  style={{ imageRendering: 'auto' }} // Ensures GIFs animate properly
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

              {/* Social Links - moved above wallet address */}
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

              {/* Wallet Address - only show if visible, now below social links */}
              {profile.wallet?.visible && profile.wallet?.address && (
                <div className="p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-mono text-gray-400 truncate max-w-[200px] sm:max-w-[300px]">
                      {profile.wallet.address}
                    </span>
                    <button 
                      onClick={() => {
                        if (profile.wallet?.address) {
                          navigator.clipboard.writeText(profile.wallet.address)
                            .then(() => {
                              console.log('Wallet address copied to clipboard');
                            })
                            .catch(err => {
                              console.error('Failed to copy wallet address: ', err);
                            });
                        }
                      }}
                      className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                      title="Copy wallet address"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Profile button (if authenticated) */}
              {isAuthenticated && onEditProfile && (
                <Button 
                  onClick={onEditProfile}
                  variant="outline"
                  className="border-gray-600 text-cyan-300 hover:bg-gray-800 hover:text-cyan-200 transition-colors"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Spotlight section - moved above Media */}
        {(!profile.sectionVisibility || profile.sectionVisibility.spotlight) && (
          <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
               style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-semibold text-white text-center mb-4">
              SPOTLIGHT
            </h2>
            <p className="text-sm text-gray-400 text-center mb-12">
              Share your work and favorite projects
            </p>
            
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

        {/* Media section */}
        {(!profile.sectionVisibility || profile.sectionVisibility.media) && (
          <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
               style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-semibold text-white text-center mb-4">
              MEDIA
            </h2>
            <p className="text-sm text-gray-400 text-center mb-12">
              Share your music, videos, DJ mixes, and playlists
            </p>
            
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

        {/* Shop section */}
        {(!profile.sectionVisibility || profile.sectionVisibility.shop) && (
          <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
               style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-semibold text-white text-center mb-4">
              SHOP
            </h2>
            <p className="text-sm text-gray-400 text-center mb-12">
              Connect visitors to your shop and products
            </p>
            
            {shopItems && shopItems.length > 0 ? (
              shopItems.length < 3 ? (
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
              )
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
        
        {/* Sticker display - moved to bottom */}
        {profile.sticker?.visible && profile.sticker?.image ? (
          <div className="mt-24 sm:mt-32 flex justify-center opacity-0 animate-fadeIn mb-16"
               style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
            <div className="w-32 h-32 animate-sticker-rotate">
              {profile.sticker.image.startsWith('data:') ? (
                <img
                  src={profile.sticker.image}
                  alt="Profile sticker"
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'auto' }} // Ensures GIFs animate properly
                />
              ) : (
                <Image
                  src={profile.sticker.image}
                  alt="Profile sticker"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              )}
            </div>
          </div>
        ) : (
          // Daisy sticker placeholder
          <div className="mt-24 sm:mt-32 flex justify-center opacity-0 animate-fadeIn mb-16"
               style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
            <div className="w-64 h-64 animate-daisy-rotate">
              <Image
                src="/images/stickers/daisy-blue.png"
                alt="Daisy sticker"
                width={256}
                height={256}
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView; 