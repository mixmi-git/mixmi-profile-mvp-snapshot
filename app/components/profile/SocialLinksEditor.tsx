'use client';

import React, { useState } from 'react';
import { SocialLink } from '@/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '../ui/dialog';
import { Instagram, ExternalLink, Trash2, Plus } from 'lucide-react';
import { FaYoutube, FaSpotify, FaSoundcloud, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiTiktok } from 'react-icons/si';
import { validateSocialUrl } from '@/lib/validation';

// Define available social platforms
const SOCIAL_PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'soundcloud', label: 'SoundCloud' },
  { value: 'linkedin', label: 'LinkedIn' }
];

interface SocialLinksEditorProps {
  isOpen: boolean;
  onClose: () => void;
  socialLinks: SocialLink[];
  onSave: (links: SocialLink[]) => void;
}

export function SocialLinksEditor({ isOpen, onClose, socialLinks, onSave }: SocialLinksEditorProps) {
  // State for edited links
  const [links, setLinks] = useState<SocialLink[]>(() => 
    socialLinks.length > 0 
      ? [...socialLinks] 
      : []
  );
  
  // State for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Helper function to get social icon
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
        return <ExternalLink size={iconSize} className="text-gray-200" />;
    }
  };
  
  // Add new link
  const addLink = () => {
    setLinks([...links, { platform: '', url: '' }]);
  };
  
  // Remove link
  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
    
    // Clear any errors for this link
    const newErrors = { ...errors };
    delete newErrors[`${index}-platform`];
    delete newErrors[`${index}-url`];
    setErrors(newErrors);
  };
  
  // Update link
  const updateLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
    
    // Clear error for this field
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };
  
  // Validate all links before saving
  const validateLinks = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;
    
    links.forEach((link, index) => {
      // Validate platform
      if (!link.platform) {
        newErrors[`${index}-platform`] = 'Select a platform';
        isValid = false;
      }
      
      // Validate URL
      if (!link.url) {
        newErrors[`${index}-url`] = 'URL is required';
        isValid = false;
      } else {
        const validation = validateSocialUrl(link.platform, link.url);
        if (!validation.isValid) {
          newErrors[`${index}-url`] = validation.message;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle save
  const handleSave = () => {
    if (validateLinks()) {
      onSave(links);
      onClose();
    }
  };
  
  // Close without saving
  const handleCancel = () => {
    setLinks(socialLinks.length > 0 ? [...socialLinks] : []);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Social Links</DialogTitle>
          <DialogDescription>
            Add links to your social media profiles for your audience to find you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 overflow-y-auto max-h-[calc(70vh-100px)]">
          {links.length === 0 ? (
            <div className="text-center p-4 bg-gray-800/40 rounded-md">
              <p className="text-gray-400 text-sm">No social links yet. Add one below.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((link, index) => (
                <div key={index} className="space-y-3 bg-gray-800/40 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        {link.platform ? getSocialIcon(link.platform) : <ExternalLink size={16} className="text-gray-400" />}
                      </div>
                      <span className="text-sm font-medium text-gray-300">
                        {link.platform ? SOCIAL_PLATFORMS.find(p => p.value === link.platform)?.label || link.platform : 'New Link'}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeLink(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`platform-${index}`} className="text-xs text-gray-400">Platform</Label>
                      <select
                        id={`platform-${index}`}
                        value={link.platform}
                        onChange={(e) => updateLink(index, 'platform', e.target.value)}
                        className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        <option value="">Select a platform</option>
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <option 
                            key={platform.value} 
                            value={platform.value}
                            disabled={links.some((l, i) => i !== index && l.platform === platform.value)}
                          >
                            {platform.label}
                          </option>
                        ))}
                      </select>
                      {errors[`${index}-platform`] && (
                        <p className="text-xs text-red-400 mt-1">{errors[`${index}-platform`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`url-${index}`} className="text-xs text-gray-400">URL</Label>
                      <Input
                        id={`url-${index}`}
                        value={link.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        placeholder={`Enter your ${link.platform || 'social'} profile URL`}
                        className="mt-1 bg-gray-700 border-gray-600 text-white text-sm"
                      />
                      {errors[`${index}-url`] && (
                        <p className="text-xs text-red-400 mt-1">{errors[`${index}-url`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button
            type="button"
            onClick={addLink}
            variant="outline"
            className="w-full mt-4 border-dashed border-gray-600 hover:border-gray-500 bg-transparent"
            disabled={links.length >= SOCIAL_PLATFORMS.length}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Social Link
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 