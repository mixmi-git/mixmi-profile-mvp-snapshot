'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Edit2, ExternalLink } from 'lucide-react';
import { ProfileData, MediaItemType, SpotlightItemType, ShopItemType } from './UserProfileContainer';

interface ProfileViewProps {
  profile: ProfileData;
  mediaItems: MediaItemType[];
  spotlightItems: SpotlightItemType[];
  shopItems: ShopItemType[];
  isAuthenticated?: boolean;
  isTransitioning?: boolean;
  onEditProfile?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  mediaItems,
  spotlightItems,
  shopItems,
  isAuthenticated = false,
  isTransitioning = false,
  onEditProfile,
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4 sm:p-8 md:p-12 lg:p-16">
        {/* Profile section */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 opacity-0 animate-fadeIn"
             style={{ animationFillMode: 'forwards' }}>
          {/* Left column - Profile image */}
          <div className="w-full lg:w-[40%] max-w-md mx-auto lg:mx-0">
            <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-cyan-600">
              <Image
                src={profile.image || '/images/placeholder.png'}
                alt="Profile photo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                className="object-cover"
                priority
              />
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

              {/* Wallet Address - only show if visible */}
              {profile.wallet?.visible && profile.wallet?.address && (
                <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-xs text-gray-400">Wallet for tips:</span>
                    <span className="text-xs font-mono text-cyan-300 truncate max-w-[200px] sm:max-w-[300px]">
                      {profile.wallet.address}
                    </span>
                  </div>
                </div>
              )}

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
                    >
                      {/* We'll implement proper social icons later */}
                      <span className="text-xs text-cyan-300">{link.platform[0]}</span>
                    </a>
                  ))}
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
            
            {spotlightItems && spotlightItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {spotlightItems.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.link || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`group block relative rounded-lg overflow-hidden ${item.link ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="aspect-square relative bg-gray-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
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
                          <div className="flex items-center gap-2">
                            <h4 className="text-white text-sm font-medium truncate">{item.title || "Untitled"}</h4>
                            {item.link && <ExternalLink className="h-3 w-3 text-white flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:group-hover:block md:hidden">{item.description}</p>
                        </div>
                      </div>
                      
                      {/* Hover effect */}
                      {item.link && (
                        <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </a>
                ))}
              </div>
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
                        <div className="flex items-center gap-2">
                          <h4 className="text-white text-sm font-medium truncate">Your Next Event</h4>
                          <ExternalLink className="h-3 w-3 text-white flex-shrink-0" />
                        </div>
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
                        <div className="flex items-center gap-2">
                          <h4 className="text-white text-sm font-medium truncate">Featured Artist</h4>
                          <ExternalLink className="h-3 w-3 text-white flex-shrink-0" />
                        </div>
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
                        <div className="flex items-center gap-2">
                          <h4 className="text-white text-sm font-medium truncate">Latest Project</h4>
                          <ExternalLink className="h-3 w-3 text-white flex-shrink-0" />
                        </div>
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
              <div className="grid grid-cols-1 gap-8">
                {mediaItems.map((item, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg overflow-hidden">
                    <div className="aspect-video relative">
                      {/* This would be replaced with an actual embed component */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <p className="text-cyan-400">Media embed will display here</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-medium text-white">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-16 border border-dashed border-gray-700 rounded-lg">
                No media items yet
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
              Browse merchandise and exclusive content
            </p>
            
            {shopItems && shopItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopItems.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.link || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`group block relative rounded-lg overflow-hidden ${item.link ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="aspect-square relative bg-gray-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                          <p className="text-gray-500">No image</p>
                        </div>
                      )}
                      
                      {/* Corner badge - similar to the editor but optimized for viewing */}
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 p-2 
                        max-w-full transition-all duration-300 rounded-tr-md">
                        <div className="border-l-2 border-cyan-400 pl-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white text-sm font-medium truncate">{item.title || "Untitled"}</h4>
                            {item.link && <ExternalLink className="h-3 w-3 text-cyan-400 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                            {item.description}
                            {item.price && <span className="ml-1 text-cyan-300">{item.price}</span>}
                          </p>
                        </div>
                      </div>
                      
                      {/* Hover effect */}
                      {item.link && (
                        <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-16 border border-dashed border-gray-700 rounded-lg">
                No shop items yet
              </div>
            )}
          </div>
        )}
        
        {/* Sticker display - moved to bottom */}
        {profile.sticker?.visible && profile.sticker?.image && (
          <div className="mt-24 sm:mt-32 flex justify-center opacity-0 animate-fadeIn mb-16"
               style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
            <div className="w-32 h-32 animate-sticker-rotate">
              <Image
                src={profile.sticker.image}
                alt="Profile sticker"
                width={128}
                height={128}
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