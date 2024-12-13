'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface SocialLink {
  platform: string
  url: string
}

interface SocialLinksProps {
  socialLinks: SocialLink[]
  onSocialLinkChange: (index: number, field: string, value: string) => void
  onAddSocialLink: () => void
  onRemoveSocialLink: (index: number) => void
}

export function SocialLinks({
  socialLinks,
  onSocialLinkChange,
  onAddSocialLink,
  onRemoveSocialLink
}: SocialLinksProps) {
  return (
    <div className="space-y-8 pt-8 border-t border-gray-700">
      <h3 className="text-xl font-semibold">Social Links</h3>
      {socialLinks.map((link, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <Select
            value={link.platform}
            onValueChange={(value) => onSocialLinkChange(index, 'platform', value)}
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
          <Input
            value={link.url}
            onChange={(e) => onSocialLinkChange(index, 'url', e.target.value)}
            placeholder="Profile URL"
            className="flex-grow"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveSocialLink(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" onClick={onAddSocialLink} className="mt-2">
        <Plus className="w-4 h-4 mr-2" /> Add Social Link
      </Button>
    </div>
  )
} 