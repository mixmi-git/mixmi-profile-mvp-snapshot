import React, { useRef, useEffect } from 'react';
import { ProfileEditor, ProfileView } from '../components';
import { ProfileMode } from '../types';

const UserProfileContainer = () => {
  // Create refs to access editor methods
  const editorRef = useRef<ProfileEditorRefType>(null);

  // Create and expose editor actions through the ref
  useEffect(() => {
    // Provide actions if the ref exists
    if (editorActionsRef.current) {
      const saveFunction = () => {
        console.log('💾 Save triggered from navbar', {
          profileName: profile.name,
          mediaItems: mediaItems.length,
          currentMode
        });
        
        // Get current form data from the editor if in edit mode and ref is available
        if (currentMode === ProfileMode.EDIT && editorRef.current) {
          const currentFormData = editorRef.current.getCurrentFormData();
          console.log('📝 Got current form data from editor', currentFormData);
          
          // Create a complete profile object with all form data
          const completeProfile = {
            ...currentFormData.profile,
            hasEditedProfile: true,
            spotlightItems: currentFormData.spotlightItems,
            mediaItems: currentFormData.mediaItems,
            shopItems: currentFormData.shopItems
          };
          
          // Save the data to localStorage
          saveProfileData(completeProfile);
        } else {
          // Fallback to using the current state data if not in edit mode or ref not available
          const completeProfile = {
            ...profile,
            hasEditedProfile: true,
            spotlightItems,
            mediaItems,
            shopItems
          };
          
          // Save the data to localStorage
          saveProfileData(completeProfile);
        }
        
        // Force transition back to view mode
        console.log('🔄 Transitioning to view mode after save');
        setCurrentMode(ProfileMode.VIEW);
      };
      
      const cancelFunction = () => {
        console.log('❌ Cancel triggered from navbar');
        setCurrentMode(ProfileMode.VIEW);
      };
      
      // Expose actions through the ref
      editorActionsRef.current = {
        save: saveFunction,
        cancel: cancelFunction
      };
    }
  }, [profile, mediaItems, spotlightItems, shopItems, currentMode, editorActionsRef]);

  // Render based on current mode
  const renderContent = () => {
    if (currentMode === ProfileMode.EDIT) {
      return (
        <ProfileEditor
          ref={editorRef}
          profile={profile}
          spotlightItems={spotlightItems}
          mediaItems={mediaItems}
          shopItems={shopItems}
          onSave={handleSave}
          onPreview={() => transitionMode(ProfileMode.VIEW)}
        />
      );
    } else {
      return (
        <ProfileView
          profile={profile}
          spotlightItems={spotlightItems}
          mediaItems={mediaItems}
          shopItems={shopItems}
          onEdit={() => transitionMode(ProfileMode.EDIT)}
        />
      );
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default UserProfileContainer; 