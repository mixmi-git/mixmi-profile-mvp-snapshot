'use client';

import { useCallback, useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/lib/auth'

/**
 * NavbarContainer handles authentication logic and renders the Navbar
 * This pattern helps isolate auth logic from the main profile component
 */

interface NavbarContainerProps {
  // Auth state that can be passed from parent
  isAuthenticated?: boolean;
}

// Enhanced Navbar Container with better debug features
export function NavbarContainer({ 
  isAuthenticated: propIsAuthenticated
}: NavbarContainerProps) {
  const { isAuthenticated: authIsAuthenticated, connectWallet, disconnectWallet, refreshAuthState, isInitialized } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  // Use provided authentication state if available, otherwise use from hook
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : authIsAuthenticated;
  
  // Add debug logging for authentication state
  useEffect(() => {
    console.log('🔑 NavbarContainer state:', { 
      propIsAuthenticated,
      authIsAuthenticated,
      isAuthenticated,
      isInitialized
    })
  }, [propIsAuthenticated, authIsAuthenticated, isAuthenticated, isInitialized])
  
  // Implement handleLoginToggle for the login/logout button
  const handleLoginToggle = useCallback(async () => {
    try {
      console.log('🔄 NavbarContainer login toggle called');
      
      // Set loading state to provide feedback to the user
      setIsLoading(true);
      
      if (isAuthenticated) {
        await disconnectWallet();
      } else {
        await connectWallet();
        // Force refresh auth state after connection
        setTimeout(() => {
          refreshAuthState();
        }, 1000);
        
        // Also do a second refresh after a longer delay to catch any delayed updates
        setTimeout(() => {
          console.log('🔄 Performing delayed auth refresh check');
          refreshAuthState();
          
          // Store auth status in localStorage for persistence across page refreshes
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('mixmi-last-auth-check', new Date().toISOString());
            } catch (e) {
              console.error('Failed to update auth check timestamp:', e);
            }
          }
        }, 3000);
      }
      
      // Set a timeout to reset loading state if connection takes too long
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Error in login toggle:', error);
      setIsLoading(false);
    }
  }, [isAuthenticated, connectWallet, disconnectWallet, refreshAuthState]);
  
  // Force refresh auth state periodically when not authenticated
  useEffect(() => {
    if (!isAuthenticated && isInitialized) {
      const checkInterval = setInterval(() => {
        refreshAuthState();
      }, 2000);
      
      return () => clearInterval(checkInterval);
    }
  }, [isAuthenticated, refreshAuthState, isInitialized]);
  
  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLoginToggle={handleLoginToggle}
      />
    </>
  )
} 