'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [profileMode, setProfileMode] = useState<ProfileMode>(ProfileMode.VIEW);
  const editorActionsRef = useRef<{
    save: () => void;
    cancel: () => void;
  }>({
    save: () => console.log('Save not yet available'),
    cancel: () => console.log('Cancel not yet available')
  });
  
  // Function to handle editing profile
  const handleEditProfile = () => {
    console.log('Edit profile button clicked in navbar');
    // Force UI update to ensure we transition to edit mode
    setProfileMode(ProfileMode.EDIT);
    // Log the current mode to debug
    setTimeout(() => {
      console.log('Current profile mode after Edit clicked:', profileMode);
    }, 100);
  };
  
  // Function to handle saving changes
  const handleSaveProfile = () => {
    console.log('🔄 Save profile button clicked in navbar');
    
    // Call the save function from the editor
    if (typeof editorActionsRef.current?.save === 'function') {
      console.log('✅ Calling save function from editor');
      editorActionsRef.current.save();
      
      // Also update our local state to match
      setProfileMode(ProfileMode.VIEW);
    } else {
      console.error('⚠️ Save action not available - editor ref not initialized');
      // Fallback - just switch to view mode
      setProfileMode(ProfileMode.VIEW);
    }
  };
  
  // Function to handle canceling edits
  const handleCancelEdit = () => {
    console.log('🔄 Cancel edit button clicked in navbar');
    
    // Call the cancel function from the editor
    if (typeof editorActionsRef.current?.cancel === 'function') {
      console.log('✅ Calling cancel function from editor');
      editorActionsRef.current.cancel();
      
      // Also update our local state to match
      setProfileMode(ProfileMode.VIEW);
    } else {
      console.error('⚠️ Cancel action not available - editor ref not initialized');
      // Fallback - just switch to view mode
      setProfileMode(ProfileMode.VIEW);
    }
  };
  
  // Set up a direct reference to capture editor actions
  const captureEditorActions = useCallback((actions: any) => {
    if (actions && typeof actions.save === 'function' && typeof actions.cancel === 'function') {
      console.log('🔗 Directly captured editor actions');
      editorActionsRef.current = actions;
    }
  }, []);

  // Function to handle mode changes from the profile container
  const handleProfileModeChange = (mode: ProfileMode) => {
    console.log('Profile mode changed to:', mode);
    setProfileMode(mode);
    
    // Try to get editor actions directly from the onModeChange function property
    if ((handleProfileModeChange as any).editorActions) {
      console.log('📝 Capturing editor actions from ProfileContainer');
      editorActionsRef.current = (handleProfileModeChange as any).editorActions;
    }
  };

  // Set up handler functions as properties on handleProfileModeChange
  // This is a way to pass additional data to the UserProfileContainer
  (handleProfileModeChange as any).captureActions = captureEditorActions;

  // Debug editor actions availability
  useEffect(() => {
    console.log('🧰 Editor actions status:', {
      saveAvailable: typeof editorActionsRef.current?.save === 'function',
      cancelAvailable: typeof editorActionsRef.current?.cancel === 'function',
      profileMode
    });
  }, [profileMode, editorActionsRef.current]);

  // Debug the current mode
  useEffect(() => {
    console.log('Profile mode state updated:', {
      profileMode,
      isAuthenticated,
      isTransitioning
    });
  }, [profileMode, isAuthenticated, isTransitioning]);

  // Determine which function to pass to navbar based on mode
  const getNavbarProps = () => {
    if (profileMode === ProfileMode.EDIT) {
      return {
        inEditMode: true,
        onSaveProfile: handleSaveProfile,
        onCancelEdit: handleCancelEdit
      };
    }
    
    return {
      inEditMode: false,
      onEditProfile: isAuthenticated ? handleEditProfile : undefined
    };
  };

  return (
    <>
      <NavbarContainer {...getNavbarProps()} />
      <UserProfileContainer
        initialMode={profileMode}
        disableAuth={false}
        onModeChange={handleProfileModeChange}
      />
    </>
  );
}

export default UserProfile;