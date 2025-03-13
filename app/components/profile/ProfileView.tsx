'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
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
  // This is just a placeholder - we'll implement the full view component later
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4 sm:p-8 md:p-12 lg:p-16">
        {/* Profile section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 opacity-0 animate-fadeIn"
             style={{ animationFillMode: 'forwards' }}>
          {/* Left column - Profile image */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
            <div className="relative aspect-square overflow-hidden border border-cyan-300 rounded-lg">
              <Image
                src={profile.image || '/images/placeholder.png'}
                alt="Profile photo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right column - Profile info */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="space-y-6 lg:space-y-8 max-w-lg">
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
              <div className="flex justify-center lg:justify-start gap-4">
                {profile.socialLinks && profile.socialLinks.map((link, index) => (
                  <div key={index} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    {/* We'll implement proper social icons later */}
                    <span className="text-xs text-cyan-300">{link.platform[0]}</span>
                  </div>
                ))}
              </div>

              {/* Edit Profile button (if authenticated) */}
              {isAuthenticated && onEditProfile && (
                <Button 
                  onClick={onEditProfile}
                  className="bg-cyan-500 hover:bg-cyan-600 transition-colors"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Sticker display - moved to bottom of profile section */}
        {profile.sticker?.visible && profile.sticker?.image && (
          <div className="mt-12 flex justify-center">
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

        {/* Media section - placeholder */}
        <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
             style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
          <h2 className="text-3xl font-semibold text-white text-center mb-4">
            MEDIA
          </h2>
          <p className="text-sm text-gray-400 text-center mb-12">
            Share your music, videos, DJ mixes, and playlists
          </p>
          <div className="text-center text-gray-400">
            This section will display media items
          </div>
        </div>

        {/* Spotlight section - placeholder */}
        <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
             style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
          <h2 className="text-3xl font-semibold text-white text-center mb-4">
            SPOTLIGHT
          </h2>
          <p className="text-sm text-gray-400 text-center mb-12">
            Share your work and favorite projects
          </p>
          <div className="text-center text-gray-400">
            This section will display spotlight items
          </div>
        </div>

        {/* Shop section - placeholder */}
        <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
             style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
          <h2 className="text-3xl font-semibold text-white text-center mb-4">
            SHOP
          </h2>
          <p className="text-sm text-gray-400 text-center mb-12">
            Browse merchandise and exclusive content
          </p>
          <div className="text-center text-gray-400">
            This section will display shop items
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView; 