'use client';

import React from 'react';
import { UserProfileContainer } from './profile/UserProfileContainer';
import { ProfileMode } from '@/types';
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