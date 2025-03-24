'use client';

import React from 'react';
import { UserProfileContainer, SpotlightItemType, ShopItemType, MediaItemType } from '../profile/UserProfileContainer';
import { ProfileMode } from '@/types';
import { useAuthState } from '@/hooks/useAuthState';
import { NavbarContainer } from '../NavbarContainer';

// Example data for testing
const exampleProfile = {
  name: 'Your Name',
  title: 'Your Role / Title',
  bio: 'Tell your story here...',
  image: '/images/placeholder.png',
  socialLinks: [],
  hasEditedProfile: false,
  sectionVisibility: {
    spotlight: true,
    media: true,
    shop: true
  }
};

const exampleSpotlightItems: SpotlightItemType[] = [];
const exampleShopItems: ShopItemType[] = [];
const exampleMediaItems: MediaItemType[] = [];

export function UserProfile() {
  const { isAuthenticated, isTransitioning } = useAuthState();

  return (
    <div className="min-h-screen bg-background">
      <NavbarContainer />
      <main className="container mx-auto px-4 py-8">
        <UserProfileContainer
          initialProfile={exampleProfile}
          initialSpotlightItems={exampleSpotlightItems}
          initialShopItems={exampleShopItems}
          initialMediaItems={exampleMediaItems}
          initialMode={ProfileMode.VIEW}
          disableAuth={false}
        />
      </main>
    </div>
  );
}

export default UserProfile;