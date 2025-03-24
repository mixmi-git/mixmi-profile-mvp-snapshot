/**
 * This file exports all shared types for the application.
 * 
 * The ProfileMode enum is kept for backward compatibility but is not used
 * in the new edit-in-place functionality.
 */

// Profile mode enum (for backward compatibility)
export enum ProfileMode {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
  LOADING = 'LOADING',
  SAVING = 'SAVING'
}

// Add types for content items
export interface SpotlightItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export interface MediaItem {
  id: string;
  type: string;
  title?: string;
  rawUrl?: string;
  embedUrl?: string;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: string;
  link?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ProfileData {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
  sectionVisibility?: {
    spotlight?: boolean;
    media?: boolean;
    shop?: boolean;
    sticker?: boolean;
  };
  sticker?: {
    image: string;
    visible: boolean;
  };
  walletAddress?: string;
  showWalletAddress?: boolean;
  hasEditedProfile?: boolean;
} 