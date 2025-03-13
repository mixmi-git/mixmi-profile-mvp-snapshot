'use client'

import { useCallback, useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { useAuth } from '@/lib/auth'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'

/**
 * NavbarContainer handles authentication logic and renders the Navbar
 * This pattern helps isolate auth logic from the main profile component
 */
export function NavbarContainer() {
  const { isAuthenticated, connectWallet, disconnectWallet, refreshAuthState, isInitialized } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  
  // Add debug logging for authentication state
  useEffect(() => {
    console.log('NavbarContainer auth state:', { isAuthenticated, isInitialized })
    
    // If auth is initialized or we have a definitive auth state, we can stop loading
    if (isInitialized || isAuthenticated !== undefined) {
      setIsLoading(false)
    }
  }, [isAuthenticated, isInitialized])
  
  // Add a timeout to clear loading state even if auth initialization takes too long
  useEffect(() => {
    // Force loading to stop after 3 seconds maximum, regardless of auth state
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('NavbarContainer: Forcing loading state to end after timeout')
        setIsLoading(false)
      }
    }, 3000)
    
    return () => clearTimeout(timeout)
  }, [isLoading])
  
  // Poll for auth state changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (isInitialized) {
        refreshAuthState()
      }
    }, 2000) // Check every 2 seconds
    
    return () => clearInterval(interval)
  }, [refreshAuthState, isInitialized])
  
  // Direct connect function that bypasses hooks for testing (not used in main flow)
  const handleDirectConnect = useCallback(() => {
    console.log('NavbarContainer: Direct connect attempt');
    const appConfig = new AppConfig(['store_write']);
    const directSession = new UserSession({ appConfig });
    
    showConnect({
      appDetails: {
        name: 'Mixmi Direct',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: window.location.origin,
      onFinish: () => {
        console.log('Direct connect: onFinish triggered');
        // After direct connect, refresh the auth state from the hook
        setTimeout(() => {
          refreshAuthState();
        }, 500);
      },
      userSession: directSession,
    });
  }, [refreshAuthState]);
  
  // This is the main login toggle function
  const handleLoginToggle = useCallback(async () => {
    try {
      console.log('NavbarContainer: handleLoginToggle called');
      if (isAuthenticated) {
        console.log('NavbarContainer: Disconnecting wallet');
        await disconnectWallet();
        
        // Force a UI refresh after disconnect
        setIsLoading(true);
        setTimeout(() => {
          // Double check the auth state
          refreshAuthState();
          setIsLoading(false);
          
          // Last resort: if the UI doesn't update, suggest a page refresh
          setTimeout(() => {
            if (isAuthenticated) {
              console.log('NavbarContainer: Auth state still shows authenticated after disconnect, forcing refresh');
              window.location.reload();
            }
          }, 1000);
        }, 500);
      } else {
        console.log('NavbarContainer: Connecting wallet');
        try {
          setIsLoading(true);
          await connectWallet();
          console.log('NavbarContainer: connectWallet completed');
          setTimeout(() => {
            setIsLoading(false);
            refreshAuthState();
          }, 500);
        } catch (error) {
          console.error('NavbarContainer: Error connecting wallet:', error);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('NavbarContainer: Error in handleLoginToggle:', error);
      setIsLoading(false);
    }
  }, [isAuthenticated, connectWallet, disconnectWallet, refreshAuthState]);

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLoginToggle={handleLoginToggle}
        isLoading={isLoading}
      />
      {process.env.NODE_ENV !== 'production' && (
        <div className="fixed bottom-0 right-0 bg-gray-800 text-white text-xs p-2 z-50">
          Auth: {isAuthenticated ? 'Connected' : 'Disconnected'} | 
          Init: {isInitialized ? 'Yes' : 'No'} |
          Loading: {isLoading ? 'Yes' : 'No'}
        </div>
      )}
    </>
  )
} 