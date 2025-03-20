'use client';

import React from 'react';
import { SocialLinksProps, SOCIAL_PLATFORMS } from '../types/EditorTypes';
import { Link, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const SocialLinksSection: React.FC<SocialLinksProps> = ({
  formData,
  onChange,
  errors
}) => {
  const addSocialLink = () => {
    const newLinks = [...formData.socialLinks, { platform: '', url: '' }];
    onChange('socialLinks', newLinks);
  };

  const removeSocialLink = (index: number) => {
    const newLinks = formData.socialLinks.filter((_, i) => i !== index);
    onChange('socialLinks', newLinks);
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange('socialLinks', newLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-200">Social Links</h3>
        <Button
          type="button"
          onClick={addSocialLink}
          disabled={formData.socialLinks.length >= SOCIAL_PLATFORMS.length}
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      <div className="space-y-4">
        {formData.socialLinks.map((link, index) => {
          const error = errors.find(e => e.platform === link.platform);
          
          return (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <select
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                >
                  <option value="">Select Platform</option>
                  {SOCIAL_PLATFORMS.map(platform => (
                    <option 
                      key={platform.value} 
                      value={platform.value}
                      disabled={formData.socialLinks.some((l, i) => i !== index && l.platform === platform.value)}
                    >
                      {platform.label}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    className={`w-full pl-8 pr-3 py-2 bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-md text-white`}
                    placeholder={`Enter ${link.platform || 'platform'} URL`}
                  />
                  <Link className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error.url}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={() => removeSocialLink(index)}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {formData.socialLinks.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          Add your social media links to connect with your audience
        </p>
      )}
    </div>
  );
};

export default SocialLinksSection; 