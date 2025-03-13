'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { validateSocialUrl } from '@/lib/validation'
import { SocialLink } from '@/types/content'

interface SocialLinkError {
  platform: string;
  url: string;
}

interface SocialLinksProps {
  socialLinks: SocialLink[];
  onSocialLinkChange: (index: number, field: keyof SocialLink, value: string) => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (index: number) => void;
}

export function SocialLinks({
  socialLinks,
  onSocialLinkChange,
  onAddSocialLink,
  onRemoveSocialLink
}: SocialLinksProps) {
  const [errors, setErrors] = useState<SocialLinkError[]>([]);

  const handleUrlChange = (index: number, value: string) => {
    const link = socialLinks[index];
    if (link.platform) {
      const validation = validateSocialUrl(link.platform, value);
      
      setErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = { platform: '', url: validation.message };
        return newErrors;
      });

      if (validation.isValid) {
        onSocialLinkChange(index, 'url' as keyof SocialLink, value);
      }
    } else {
      setErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = { platform: 'Please select a platform first', url: '' };
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {socialLinks.map((link, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Select
            value={link.platform}
            onValueChange={(value) => {
              setErrors(prev => {
                const newErrors = [...prev];
                newErrors[index] = { platform: '', url: '' };
                return newErrors;
              });
              onSocialLinkChange(index, 'platform' as keyof SocialLink, value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="soundcloud">SoundCloud</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-grow">
            <Input
              value={link.url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="Profile URL"
              className={errors[index]?.url ? 'border-red-500 focus:ring-red-500' : ''}
              aria-invalid={!!errors[index]?.url}
              aria-describedby={errors[index]?.url ? `url-error-${index}` : undefined}
            />
            {errors[index]?.url && (
              <p className="text-sm text-red-500 mt-1" id={`url-error-${index}`}>
                {errors[index].url}
              </p>
            )}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveSocialLink(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" onClick={onAddSocialLink} className="mt-2">
        <Plus className="w-4 h-4 mr-2" /> Add Social Link
      </Button>
    </div>
  );
} 