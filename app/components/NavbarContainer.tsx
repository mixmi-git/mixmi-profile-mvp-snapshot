'use client';

import { useCallback, useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/lib/auth'

/**
 * NavbarContainer handles authentication logic and renders the Navbar
 * This pattern helps isolate auth logic from the main profile component
 */

interface NavbarContainerProps {
  // Edit mode props
  inEditMode?: boolean;
  onSaveProfile?: () => void;
  onCancelEdit?: () => void;
  
  // View mode props
  onEditProfile?: () => void;
}

// Enhanced Navbar Container with better debug features
export function NavbarContainer({ 
  onEditProfile, 
  inEditMode = false,
  onSaveProfile,
  onCancelEdit
}: NavbarContainerProps) {
  const { isAuthenticated, connectWallet, disconnectWallet, refreshAuthState, isInitialized } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  // Add debug logging for authentication state
  useEffect(() => {
    console.log('🔑 NavbarContainer state:', { 
      isAuthenticated, 
      isInitialized,
      inEditMode,
      hasEditCallback: !!onEditProfile,
      hasSaveCallback: !!onSaveProfile,
      hasCancelCallback: !!onCancelEdit
    })
  }, [isAuthenticated, isInitialized, onEditProfile, inEditMode, onSaveProfile, onCancelEdit])
  
  // Implement handleLoginToggle for the login/logout button
  const handleLoginToggle = useCallback(() => {
    try {
      console.log('🔄 NavbarContainer login toggle called');
      
      // Set loading state to provide feedback to the user
      setIsLoading(true);
      
      if (isAuthenticated) {
        console.log('🔌 Disconnecting wallet...');
        disconnectWallet();
        setTimeout(() => setIsLoading(false), 1000);
      } else {
        console.log('🔌 Connecting wallet...');
        connectWallet();
        
        // Set a timeout to reset loading state if connection takes too long
        setTimeout(() => setIsLoading(false), 3000);
      }
    } catch (error) {
      console.error('❌ Error in handleLoginToggle:', error);
      setIsLoading(false);
    }
  }, [isAuthenticated, connectWallet, disconnectWallet]);
  
  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLoginToggle={handleLoginToggle}
        onEditProfile={inEditMode ? undefined : onEditProfile}
        inEditMode={inEditMode}
        onSaveProfile={onSaveProfile}
        onCancelEdit={onCancelEdit}
      />
      
      {/* Debug panel showing auth state */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 right-0 bg-gray-800 text-white text-xs p-2 z-50 opacity-75">
          Status: {isAuthenticated ? '🟢 Connected' : '🔴 Disconnected'} | 
          Init: {isInitialized ? '✅' : '⏳'} |
          Mode: {inEditMode ? '✏️ Edit' : '👁️ View'} |
          Loading: {isLoading ? '⌛' : '✓'}
        </div>
      )}
    </>
  )
} 