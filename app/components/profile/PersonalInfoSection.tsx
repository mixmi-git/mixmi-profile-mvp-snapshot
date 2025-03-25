'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Copy, ExternalLink, Instagram } from 'lucide-react';
import { FaYoutube, FaSpotify, FaSoundcloud, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiTiktok } from 'react-icons/si';
import { ProfileData, SocialLink as SocialLinkType } from '@/types';
import { EditableField } from '../ui/editable-field';
import { HoverControls, EditButtonControl } from '../ui/hover-controls';
import { Button } from '../ui/button';

interface PersonalInfoSectionProps {
  profile: ProfileData;
  isAuthenticated?: boolean;
  onUpdateProfile?: (field: keyof ProfileData, value: any) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  profile,
  isAuthenticated = false,
  onUpdateProfile
}) => {
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

  // Clipboard functionality for wallet address
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Profile header with image and text */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16 mb-8">
        {/* Profile Image - left side */}
        <div className="relative group flex-shrink-0">
          {isAuthenticated ? (
            <HoverControls
              isAuthenticated={isAuthenticated}
              controlsPosition="center-right"
              controls={
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    aria-label="Change profile image"
                  />
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-gray-800/70 hover:bg-gray-700 text-white pointer-events-none"
                  >
                    Change
                  </Button>
                </div>
              }
            >
              <div className="w-60 h-60 md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] rounded-lg overflow-hidden border-2 border-cyan-600 bg-gray-800 flex items-center justify-center profile-image-container">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name || "Profile"}
                    width={420}
                    height={420}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <div className="text-5xl mb-2">👤</div>
                    <div className="text-xs">Add Photo</div>
                  </div>
                )}
              </div>
            </HoverControls>
          ) : (
            <div className="w-60 h-60 md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] rounded-lg overflow-hidden border-2 border-cyan-600 bg-gray-800 flex items-center justify-center profile-image-container">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name || "Profile"}
                  width={420}
                  height={420}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  <div className="text-5xl mb-2">👤</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Profile info - left aligned on desktop, center on mobile */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
          <div className="mb-3">
            <EditableField
              value={profile.name}
              onSave={(value) => onUpdateProfile?.('name', value)}
              placeholder="Your Name"
              className="inline-block"
              labelClassName="text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-300 profile-name"
              isAuthenticated={isAuthenticated}
            />
          </div>
          
          <div className="mb-6">
            <EditableField
              value={profile.title}
              onSave={(value) => onUpdateProfile?.('title', value)}
              placeholder="Your Title or Tagline"
              className="inline-block"
              labelClassName="text-xl md:text-2xl text-gray-300 mt-2 profile-title"
              isAuthenticated={isAuthenticated}
            />
          </div>
          
          <div className="mb-8 max-w-2xl w-full">
            <EditableField
              value={profile.bio}
              onSave={(value) => onUpdateProfile?.('bio', value)}
              placeholder="Tell your story here..."
              multiline
              rows={4}
              className="w-full"
              labelClassName="text-gray-300 leading-relaxed text-sm md:text-base profile-bio"
              isAuthenticated={isAuthenticated}
            />
          </div>
          
          {/* Social links */}
          <div className="flex flex-wrap md:justify-start justify-center gap-3">
            {profile.socialLinks && profile.socialLinks.map((link: SocialLinkType, index: number) => (
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
            ))}
            
            {isAuthenticated && (
              <EditButtonControl
                onEdit={() => alert('Edit social links')}
                label="Edit Links"
                isAuthenticated={isAuthenticated}
                className="p-2 rounded-full"
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                  <span className="text-xs text-gray-300">+</span>
                </div>
              </EditButtonControl>
            )}
          </div>
        </div>
      </div>
      
      {/* Wallet address display (if enabled) */}
      {profile.walletAddress && profile.showWalletAddress && (
        <div className="max-w-md mx-auto md:mx-0 mb-4 px-4 py-2 bg-gray-800/50 rounded-lg flex items-center justify-between border border-gray-700/50">
          <div className="text-sm text-gray-300 truncate">
            {profile.walletAddress.slice(0, 6)}...{profile.walletAddress.slice(-4)}
          </div>
          <button
            onClick={() => copyToClipboard(profile.walletAddress || '')}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            aria-label={copied ? "Copied to clipboard" : "Copy wallet address"}
          >
            <Copy size={14} className={copied ? "text-green-400" : "text-gray-400"} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection; 