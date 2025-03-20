import { ProfileData as BaseProfileData, MediaItemType as BaseMediaItemType, SpotlightItemType as BaseSpotlightItemType, ShopItemType as BaseShopItemType } from '../../UserProfileContainer';

export type ProfileData = BaseProfileData;
export type MediaItemType = BaseMediaItemType;
export type SpotlightItemType = BaseSpotlightItemType;
export type ShopItemType = BaseShopItemType;

export interface SocialLinkError {
  platform: string;
  url: string;
}

export interface BaseSectionProps {
  onSave?: () => void;
  isDirty?: boolean;
}

export interface ProfileDetailsProps extends BaseSectionProps {
  formData: ProfileData;
  onChange: (field: keyof ProfileData, value: any) => void;
  onImageUpload: (file: File) => void;
  socialLinkErrors: SocialLinkError[];
}

export interface SpotlightSectionProps extends BaseSectionProps {
  items: SpotlightItemType[];
  onChange: (index: number, field: keyof SpotlightItemType, value: any) => void;
  onImageUpload: (index: number, file: File) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export interface MediaSectionProps extends BaseSectionProps {
  items: MediaItemType[];
  onChange: (index: number, field: keyof MediaItemType, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  error?: string;
}

export interface ShopSectionProps extends BaseSectionProps {
  items: ShopItemType[];
  onChange: (index: number, field: keyof ShopItemType, value: any) => void;
  onImageUpload: (index: number, file: File) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export interface StickerSectionProps extends BaseSectionProps {
  sticker: ProfileData['sticker'];
  onChange: (sticker: ProfileData['sticker']) => void;
  onImageUpload: (file: File) => void;
}

export const SOCIAL_PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'soundcloud', label: 'SoundCloud' },
  { value: 'linkedin', label: 'LinkedIn' }
] as const;

export const mediaPreviewStyles = {
  container: "w-full max-w-xs mx-auto border border-gray-700 rounded overflow-hidden bg-gray-900/30",
  aspectRatio: {
    youtube: "pb-[56.25%]", // 16:9 aspect ratio
    soundcloud: "pb-[120px]", // Fixed height for SoundCloud
    spotify: "pb-[80px]", // Fixed height for Spotify track
    spotifyPlaylist: "pb-[280px]", // Fixed height for Spotify playlist
    appleMusic: "pb-[175px]", // Fixed height for Apple Music
    appleMusicPlaylist: "pb-[300px]" // Fixed height for Apple Music playlist
  }
} as const; 