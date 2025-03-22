'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UserProfileContainer, ProfileMode } from './profile/UserProfileContainer';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuth } from '@/lib/auth';
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
  const { refreshAuthState } = useAuth();
  const [profileMode, setProfileMode] = useState<ProfileMode>(ProfileMode.VIEW);
  const editorActionsRef = useRef<{
    save: () => void;
    cancel: () => void;
  }>({
    save: () => console.log('Save not yet available'),
    cancel: () => console.log('Cancel not yet available')
  });
  
  // Enhanced authentication state logging
  useEffect(() => {
    console.log('🔐 UserProfile Auth changed:', { 
      isAuthenticated, 
      profileMode,
      timestamp: new Date().toISOString()
    });
    
    // Force a re-render of child components when auth state changes
    const forceUpdate = setTimeout(() => {
      if (profileMode === ProfileMode.VIEW) {
        console.log('🔄 Forcing child component updates after auth change');
        const tempMode = ProfileMode.LOADING;
        setProfileMode(tempMode);
        setTimeout(() => setProfileMode(ProfileMode.VIEW), 50);
      }
    }, 500);
    
    return () => clearTimeout(forceUpdate);
  }, [isAuthenticated]);
  
  // Periodically refresh auth state
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshAuthState();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [refreshAuthState]);
  
  // Function to handle editing profile
  const handleEditProfile = () => {
    setProfileMode(ProfileMode.EDIT);
  };
  
  // Function to handle saving changes
  const handleSaveProfile = () => {
    if (typeof editorActionsRef.current?.save === 'function') {
      editorActionsRef.current.save();
      // Always force the view mode after saving
      setTimeout(() => {
        setProfileMode(ProfileMode.VIEW);
      }, 100);
    } else {
      // Fallback to view mode if save function isn't available
      setProfileMode(ProfileMode.VIEW);
    }
  };
  
  // Function to handle canceling edits
  const handleCancelEdit = () => {
    if (typeof editorActionsRef.current?.cancel === 'function') {
      editorActionsRef.current.cancel();
    } else {
      // Fallback to view mode if cancel function isn't available
      setProfileMode(ProfileMode.VIEW);
    }
  };
  
  // Direct capture of editor actions from UserProfileContainer
  const captureEditorActions = useCallback((actions: any) => {
    if (actions && typeof actions.save === 'function' && typeof actions.cancel === 'function') {
      editorActionsRef.current = actions;
    }
  }, []);

  // Function to handle mode changes from the profile container
  const handleProfileModeChange = (mode: ProfileMode) => {
    setProfileMode(mode);
  };

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
      onEditProfile: isAuthenticated ? handleEditProfile : undefined,
      isAuthenticated: isAuthenticated
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarContainer {...getNavbarProps()} />
      
      <main className="flex-grow">
        <UserProfileContainer 
          initialMode={profileMode}
          onModeChange={handleProfileModeChange}
          onCaptureEditorActions={captureEditorActions}
          disableAuth={false}
        />
      </main>
    </div>
  );
}

export default UserProfile;