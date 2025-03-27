'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Copy, ExternalLink, Instagram, Edit, Edit2 } from 'lucide-react';
import { FaYoutube, FaSpotify, FaSoundcloud, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiTiktok } from 'react-icons/si';
import { ProfileData, SocialLink as SocialLinkType } from '@/types';
import { EditableField } from '../ui/editable-field';
import { HoverControls, EditButtonControl } from '../ui/hover-controls';
import { Button } from '../ui/button';
import { SocialLinksEditor } from './SocialLinksEditor';
import { ProfileInfoEditor } from './ProfileInfoEditor';
import { PersonalInfoEditorModal } from './editor/modals/PersonalInfoEditorModal';

interface PersonalInfoSectionProps {
  profile: ProfileData;
  isAuthenticated?: boolean;
  onUpdateProfile?: (field: keyof ProfileData | 'profileInfo', value: any) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  profile,
  isAuthenticated = false,
  onUpdateProfile
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = (updates: Partial<ProfileData>) => {
    if (onUpdateProfile) {
      // Send profile info update
      const profileInfoUpdated = updates.name !== undefined || 
                               updates.title !== undefined || 
                               updates.bio !== undefined;
      
      if (profileInfoUpdated) {
        const profileInfo = {
          name: updates.name ?? profile.name ?? '',
          title: updates.title ?? profile.title ?? '',
          bio: updates.bio ?? profile.bio ?? ''
        };
        console.log('Updating profile info:', profileInfo);
        onUpdateProfile('profileInfo', profileInfo);
      }
      
      // Send social links update if changed
      if (updates.socialLinks !== undefined) {
        console.log('Updating social links:', updates.socialLinks);
        onUpdateProfile('socialLinks', updates.socialLinks);
      }
      
      // Send wallet visibility update if changed
      if (updates.showWalletAddress !== undefined) {
        console.log('Updating wallet visibility:', updates.showWalletAddress);
        onUpdateProfile('showWalletAddress', updates.showWalletAddress);
      }
    }
    setIsEditorOpen(false);
  };

  // Social media icon mapping
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

  // Handle profile image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result && onUpdateProfile) {
        onUpdateProfile('image', e.target.result.toString());
      }
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <section className="py-8 md:py-12 lg:py-16 w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
        {/* Profile picture */}
        <div className="relative w-64 h-64 md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] overflow-hidden rounded-lg border-2 border-cyan-300 bg-gray-800">
          <Image
            src={profile.image || '/images/placeholder-profile.jpg'}
            alt={profile.name || 'Profile'}
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />
          
          {isAuthenticated && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
              <label htmlFor="profile-image" className="cursor-pointer">
                <div className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md">
                  Change Image
                </div>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}
        </div>
        
        {/* Profile text info */}
        <div className="flex-1 flex flex-col items-center md:items-center justify-center relative">
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditorOpen(true)}
              className="absolute -top-8 right-0 text-cyan-400 border-cyan-800 hover:bg-cyan-950/50 hover:text-cyan-300 hover:border-cyan-600"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Section
            </Button>
          )}

          <div className="mb-8">
            <div className="mb-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-300">
                {profile.name || "Your Name"}
              </h1>
            </div>
            
            <h2 className="text-base md:text-xl text-gray-300 mt-2 text-center">
              {profile.title || "What You Do"}
            </h2>
          </div>
          
          <div className="mb-8 max-w-2xl w-full">
            <p className="text-xs md:text-sm leading-relaxed text-gray-300 text-center">
              {profile.bio || "Tell your story here..."}
            </p>
          </div>
          
          {/* Social links */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {profile.socialLinks && profile.socialLinks.length > 0 ? (
              profile.socialLinks.map((link, index) => (
                <a
                  key={`${link.platform}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  aria-label={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))
            ) : (
              <>
                <div className="inline-flex items-center justify-center p-2 bg-gray-800/60 rounded-full cursor-default opacity-60">
                  <Instagram size={18} className="text-gray-400" />
                </div>
                <div className="inline-flex items-center justify-center p-2 bg-gray-800/60 rounded-full cursor-default opacity-60">
                  <FaYoutube size={18} className="text-gray-400" />
                </div>
                <div className="inline-flex items-center justify-center p-2 bg-gray-800/60 rounded-full cursor-default opacity-60">
                  <FaXTwitter size={18} className="text-gray-400" />
                </div>
                <div className="inline-flex items-center justify-center p-2 bg-gray-800/60 rounded-full cursor-default opacity-60">
                  <FaSpotify size={18} className="text-gray-400" />
                </div>
              </>
            )}
          </div>
          
          {/* Wallet address display */}
          {profile.walletAddress && (isAuthenticated || profile.showWalletAddress !== false) && (
            <div className="w-full max-w-xs mx-auto px-3 py-2 bg-gray-800/50 rounded-lg flex items-center justify-between border border-gray-700/50 mt-4">
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-300 truncate">
                  {profile.walletAddress.slice(0, 6)}...{profile.walletAddress.slice(-4)}
                </div>
                {isAuthenticated && profile.showWalletAddress === false && (
                  <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">Hidden</span>
                )}
              </div>
              
              <button
                onClick={() => copyToClipboard(profile.walletAddress || '')}
                className="text-gray-400 hover:text-gray-300 p-1"
                aria-label="Copy wallet address"
              >
                {copied ? (
                  <span className="text-xs text-green-500">Copied!</span>
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <PersonalInfoEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        profile={profile}
        onSave={handleSave}
      />
    </section>
  );
};

export default PersonalInfoSection; 