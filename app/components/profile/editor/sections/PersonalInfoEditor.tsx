import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PersonalInfoEditorProps, ProfileData, SocialLinkType } from '@/types/profile';
import { Instagram, Trash2 } from 'lucide-react';
import { FaYoutube, FaSpotify, FaSoundcloud, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'youtube', label: 'YouTube', icon: FaYoutube },
  { id: 'twitter', label: 'Twitter', icon: FaXTwitter },
  { id: 'spotify', label: 'Spotify', icon: FaSpotify },
  { id: 'soundcloud', label: 'SoundCloud', icon: FaSoundcloud },
  { id: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn },
];

const MAX_LENGTHS = {
  name: 40,
  title: 40,
  bio: 350
} as const;

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<ProfileData>({
    ...profile,
    name: profile.name || '',
    title: profile.title || '',
    bio: profile.bio || '',
    socialLinks: [...(profile.socialLinks || []), { platform: '', url: '' }],
  });

  // Use a ref to track if the component is mounted
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    if (!isMounted.current) return;
    
    // Apply character limits for text fields
    if (field === 'name' || field === 'title' || field === 'bio') {
      const maxLength = MAX_LENGTHS[field];
      if (typeof value === 'string' && value.length > maxLength) {
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLinkType, value: string) => {
    if (!isMounted.current) return;
    
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };

    // If this is the last row and user is typing, add a new empty row
    if (index === newLinks.length - 1 && (value !== '' || newLinks[index].platform !== '' || newLinks[index].url !== '')) {
      newLinks.push({ platform: '', url: '' });
    }

    // Remove empty rows except the last one
    const cleanedLinks = newLinks.filter((link, i) => 
      i === newLinks.length - 1 || (link.platform !== '' || link.url !== '')
    );

    handleInputChange('socialLinks', cleanedLinks);
  };

  const removeSocialLink = (index: number) => {
    if (!isMounted.current) return;
    
    const newLinks = formData.socialLinks.filter((_, i) => i !== index);
    
    // Ensure there's always at least one empty row
    if (newLinks.length === 0 || newLinks[newLinks.length - 1].platform !== '' || newLinks[newLinks.length - 1].url !== '') {
      newLinks.push({ platform: '', url: '' });
    }
    
    handleInputChange('socialLinks', newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMounted.current) return;
    
    try {
      // Only send fields that have changed
      const updates: Partial<ProfileData> = {};
      
      // Check each field, ensuring we handle empty strings correctly
      if (formData.name !== profile.name) {
        updates.name = formData.name;
      }
      if (formData.title !== profile.title) {
        updates.title = formData.title;
      }
      if (formData.bio !== profile.bio) {
        updates.bio = formData.bio;
      }
      if (formData.showWalletAddress !== profile.showWalletAddress) {
        updates.showWalletAddress = formData.showWalletAddress;
      }
      
      // Handle BTC address and visibility
      console.log('BTC form data:', {
        currentBtc: profile.btcAddress,
        newBtc: formData.btcAddress,
        currentVisibility: profile.showBtcAddress,
        newVisibility: formData.showBtcAddress
      });
      
      if (formData.btcAddress !== profile.btcAddress) {
        updates.btcAddress = formData.btcAddress;
      }
      if (formData.showBtcAddress !== profile.showBtcAddress) {
        updates.showBtcAddress = formData.showBtcAddress;
      }
      
      // Clean up social links before comparing (remove empty ones)
      const cleanedLinks = formData.socialLinks.filter(link => 
        link.platform !== '' && link.url !== ''
      );
      
      // Only update if links have changed
      const currentLinks = JSON.stringify(profile.socialLinks || []);
      const newLinks = JSON.stringify(cleanedLinks);
      if (currentLinks !== newLinks) {
        updates.socialLinks = cleanedLinks;
      }

      console.log('Saving updates:', updates); // Add logging
      
      if (Object.keys(updates).length > 0) {
        await onSave(updates);
      }
      
      if (isMounted.current) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="name" className="block mb-0.5 text-sm">Name</Label>
          <div className="relative">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your name"
              maxLength={MAX_LENGTHS.name}
              className="bg-gray-800 border-gray-700 pr-16 h-9"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {formData.name.length}/{MAX_LENGTHS.name}
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="title" className="block mb-0.5 text-sm">Title</Label>
          <div className="relative">
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What you do"
              maxLength={MAX_LENGTHS.title}
              className="bg-gray-800 border-gray-700 pr-16 h-9"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {formData.title.length}/{MAX_LENGTHS.title}
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="bio" className="block mb-0.5 text-sm">Bio</Label>
          <div className="relative">
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell your story..."
              maxLength={MAX_LENGTHS.bio}
              className="bg-gray-800 border-gray-700 min-h-[80px] pr-16"
            />
            <span className="absolute right-3 top-3 text-xs text-gray-400">
              {formData.bio.length}/{MAX_LENGTHS.bio}
            </span>
          </div>
        </div>

        {/* Wallet Addresses Section */}
        <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 mt-2">
          <Label className="text-sm font-medium text-gray-200">Wallet Addresses</Label>
          
          {/* STX Wallet Address */}
          {formData.walletAddress && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-300">STX Address</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="show-stx-wallet" className="text-xs text-gray-300">Show publicly</Label>
                  <Switch
                    id="show-stx-wallet"
                    checked={formData.showWalletAddress !== false}
                    onCheckedChange={(checked) => handleInputChange('showWalletAddress', checked)}
                    className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-600 border-2 border-gray-400"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded border border-gray-700 overflow-auto whitespace-nowrap">
                {formData.walletAddress}
                <div className="text-xs text-gray-500 mt-0.5">
                  Displays as: {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-4)}
                </div>
              </div>
            </div>
          )}
          
          {/* BTC Wallet Address */}
          <div className="flex flex-col space-y-1 mt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-300">BTC Address</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="show-btc-wallet" className="text-xs text-gray-300">Show publicly</Label>
                <Switch
                  id="show-btc-wallet"
                  checked={formData.showBtcAddress !== false}
                  onCheckedChange={(checked) => handleInputChange('showBtcAddress', checked)}
                  className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-600 border-2 border-gray-400"
                />
              </div>
            </div>
            
            <Input
              value={formData.btcAddress || ''}
              onChange={(e) => handleInputChange('btcAddress', e.target.value)}
              placeholder="Add your Bitcoin address (optional)"
              className="bg-gray-800 border-gray-700 text-gray-200 h-9"
            />
            <p className="text-xs text-gray-400 mt-0">Enter your Bitcoin address if you want to display it on your profile</p>
          </div>
        </div>

        <div className="space-y-2 mt-2">
          <Label className="text-sm">Social Links</Label>
          <div className="space-y-2">
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-2 group">
                <select
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                  className="bg-gray-800 border-gray-700 rounded-md text-xs p-1.5 flex-shrink-0 text-gray-200 h-9"
                >
                  <option value="" className="text-gray-200 bg-gray-800">Select Platform</option>
                  {SOCIAL_PLATFORMS.map(platform => (
                    <option key={platform.id} value={platform.id} className="text-gray-200 bg-gray-800">
                      {platform.label}
                    </option>
                  ))}
                </select>

                <Input
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  placeholder="https://"
                  className="bg-gray-800 border-gray-700 flex-1 text-gray-200 h-9"
                />

                {/* Only show delete button if it's not the last empty row */}
                {(index < formData.socialLinks.length - 1 || link.platform !== '' || link.url !== '') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSocialLink(index)}
                    className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-3 mt-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-gray-300 hover:text-gray-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}; 