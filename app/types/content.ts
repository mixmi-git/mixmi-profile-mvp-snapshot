/**
 * Shared content type definitions for profile components
 */

/**
 * SpotlightItem represents content featured in the Spotlight section
 */
export interface SpotlightItem {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

/**
 * Project is an alias for SpotlightItem to maintain backward compatibility
 */
export type Project = SpotlightItem;

/**
 * ShopItem represents products in the Shop section
 */
export interface ShopItem {
  id: number;
  title: string;
  storeUrl: string;
  image: string;
  platform: 'shopify' | 'etsy' | 'gumroad' | 'bigcartel' | 'other';
  description?: string;
}

/**
 * SocialLink represents a social media link in the Profile
 */
export interface SocialLink {
  platform: string;
  url: string;
}

/**
 * SectionVisibility controls which sections are displayed in the Profile
 */
export interface SectionVisibility {
  projects: boolean;
  media: boolean;
  shop: boolean;
}

/**
 * Profile represents the user's personal information and settings
 */
export interface Profile {
  name: string;
  title: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
  sectionVisibility: SectionVisibility;
  spotlightDescription: string;
}

/**
 * FormError represents a validation error for a form field
 */
export interface FormError {
  message: string;
  isValid: boolean;
}

/**
 * FormErrors represents all validation errors for the profile form
 */
export interface FormErrors {
  name: FormError;
  title: FormError;
  bio: FormError;
  socialLinks: FormError[];
}

/**
 * Sticker represents a decorative element on the profile
 */
export interface Sticker {
  enabled: boolean;
  image: string;
} 