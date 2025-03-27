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
  name: 30,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <Label htmlFor="name">Name</Label>
            <span className="text-xs text-gray-400">
              {formData.name.length}/{MAX_LENGTHS.name}
            </span>
          </div>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Your name"
            maxLength={MAX_LENGTHS.name}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <Label htmlFor="title">Title</Label>
            <span className="text-xs text-gray-400">
              {formData.title.length}/{MAX_LENGTHS.title}
            </span>
          </div>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="What you do"
            maxLength={MAX_LENGTHS.title}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <Label htmlFor="bio">Bio</Label>
            <span className="text-xs text-gray-400">
              {formData.bio.length}/{MAX_LENGTHS.bio}
            </span>
          </div>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell your story..."
            maxLength={MAX_LENGTHS.bio}
            className="bg-gray-800 border-gray-700 min-h-[100px]"
          />
        </div>

        {formData.walletAddress && (
          <div className="flex items-center justify-between space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex flex-col space-y-1">
              <Label>Wallet Address</Label>
              <div className="text-sm text-gray-400">
                {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-4)}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="show-wallet" className="text-sm text-gray-300">Show publicly</Label>
              <Switch
                id="show-wallet"
                checked={formData.showWalletAddress !== false}
                onCheckedChange={(checked) => handleInputChange('showWalletAddress', checked)}
                className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-600 border-2 border-gray-400"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label>Social Links</Label>
          <div className="space-y-3">
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-2 group">
                <select
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                  className="bg-gray-800 border-gray-700 rounded-md text-sm p-2 flex-shrink-0 text-gray-200"
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
                  className="bg-gray-800 border-gray-700 flex-1 text-gray-200"
                />

                {/* Only show delete button if it's not the last empty row */}
                {(index < formData.socialLinks.length - 1 || link.platform !== '' || link.url !== '') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSocialLink(index)}
                    className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300"
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