'use client';

import React from 'react';
import { UserProfileContainer, ProfileMode } from './profile/UserProfileContainer';
import { useAuthState } from '@/hooks/useAuthState';
import { NavbarContainer } from './NavbarContainer';

// Example data for testing
const exampleProfile = {
  name: 'Your Name',
  title: 'Your Role / Title',
  bio: 'Tell your story here...',
  image: '/images/placeholder.png',
  socialLinks: [],
};

export function UserProfile() {
  const { isAuthenticated, isTransitioning } = useAuthState();

  return (
    <>
      <NavbarContainer />
      <UserProfileContainer
        initialMode={ProfileMode.VIEW}
        disableAuth={false}
      />
    </>
  );
}

export default UserProfile;