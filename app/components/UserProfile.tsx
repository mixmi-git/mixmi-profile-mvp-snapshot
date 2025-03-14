'use client';

import React from 'react';
import UserProfileContainer, { ProfileMode } from './profile/UserProfileContainer';

// Example data for testing
const exampleProfile = {
  name: 'Your Name',
  title: 'Your Role / Title',
  bio: 'Tell your story here...',
  image: '/images/placeholder.png',
  socialLinks: [],
};

// This is now just a wrapper that uses the container component
const UserProfile: React.FC = () => {
  return (
    <UserProfileContainer
      initialProfile={exampleProfile}
      initialSpotlightItems={[]}
      initialShopItems={[]}
      initialMediaItems={[]}
      // For development, we can use these flags:
      // initialMode={ProfileMode.EDIT} 
      // disableAuth={true}
    />
  );
};

export default UserProfile;