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
  const [debugMessage, setDebugMessage] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  
  const devMode = process.env.NODE_ENV === 'development';
  
  // Use provided authentication state if available, otherwise use from hook
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : authIsAuthenticated;
  
  // Enforce dev mode override for button state
  useEffect(() => {
    // If in development mode and window.DEV_FORCE_AUTH is true, force refresh auth
    if (devMode && typeof window !== 'undefined' && (window as any).DEV_FORCE_AUTH) {
      console.log('🔧 DEV: NavbarContainer detected forced auth enabled');
      refreshAuthState();
    }
  }, [devMode, refreshAuthState]);
  
  // Add debug logging for authentication state
  useEffect(() => {
    console.log('🔑 NavbarContainer state:', { 
      propIsAuthenticated,
      authIsAuthenticated,
      isAuthenticated,
      isInitialized,
      devMode,
      devForceAuth: typeof window !== 'undefined' ? (window as any).DEV_FORCE_AUTH : undefined
    })
  }, [propIsAuthenticated, authIsAuthenticated, isAuthenticated, isInitialized, devMode]);
  
  // Toggle debug display
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt+D toggles debug mode
      if (e.altKey && e.key === 'd') {
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  // Implement handleLoginToggle for the login/logout button
  const handleLoginToggle = useCallback(async () => {
    try {
      console.log('🔄 NavbarContainer login toggle called');
      
      // In dev mode with DEV_FORCE_AUTH, just toggle the auth state and reload
      if (devMode && typeof window !== 'undefined') {
        console.log('🔧 DEV: Using development mode toggle');
        setIsLoading(true);
        setDebugMessage('Toggling authentication state in dev mode...');
        
        // Toggle auth state
        if ((window as any).toggleAuth) {
          (window as any).toggleAuth();
        } else {
          console.warn('🔧 DEV: toggleAuth function not available');
        }
        
        // Refresh the auth state without reloading page
        setTimeout(() => {
          refreshAuthState();
          setIsLoading(false);
          setDebugMessage('Auth state toggled in dev mode.');
        }, 300);
        
        return;
      }
      
      // Set loading state to provide feedback to the user
      setIsLoading(true);
      setDebugMessage('Starting wallet connection...');
      
      if (isAuthenticated) {
        console.log('Disconnecting wallet...');
        setDebugMessage('Disconnecting wallet...');
        await disconnectWallet();
        
        // Clear any lingering auth data
        if (typeof window !== 'undefined') {
          // Clear specific auth-related items in localStorage
          const keysToRemove = Object.keys(localStorage).filter(key => 
            (key.includes('blockstack') || 
            key.includes('stacks') ||
            key.includes('authResponse') ||
            key.includes('mixmi-last-auth-check') ||
            key.includes('mixmi-wallet-')) &&
            // Don't remove content data
            !key.includes('mixmi_profile_data') &&
            !key.includes('mixmi_spotlight_items') &&
            !key.includes('mixmi_shop_items') &&
            !key.includes('mixmi_media_items') &&
            !key.includes('mixmi_sticker_data') &&
            !key.includes('mixmi_account_profile_map')
          );
          
          console.log('🗑️ Removing these auth keys:', keysToRemove);
          setDebugMessage('Cleaning up wallet data...');
          
          keysToRemove.forEach(key => {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.error(`Error removing ${key}:`, e);
              setDebugMessage(`Error removing storage key: ${key}`);
            }
          });
          
          // Force a page reload to complete disconnect
          setTimeout(() => {
            console.log('🔄 Reloading page to complete wallet disconnect...');
            setDebugMessage('Reloading page...');
            window.location.reload();
          }, 500);
        }
      } else {
        console.log('Connecting wallet...');
        
        // Check for wallet extensions
        if (typeof window === 'undefined') {
          setDebugMessage('Not in browser environment');
          setIsLoading(false);
          return;
        }
        
        // Use simple connection approach that's working in the /wallet page
        try {
          setDebugMessage('Preparing wallet connection...');
          
          // Use the standard Stacks connection approach that works with both wallet types
          const { showConnect, AppConfig, UserSession } = await import('@stacks/connect');
          const appConfig = new AppConfig(['store_write']);
          const userSession = new UserSession({ appConfig });
          
          setDebugMessage('Showing wallet dialog. Please check your browser extensions...');
          
          showConnect({
            appDetails: {
              name: 'Mixmi',
              icon: window.location.origin + '/favicon.ico',
            },
            redirectTo: window.location.origin,
            onFinish: () => {
              if (userSession.isUserSignedIn()) {
                const userData = userSession.loadUserData();
                const address = userData.profile.stxAddress.mainnet;
                
                setDebugMessage(`Connected! Address: ${address.slice(0, 6)}...${address.slice(-4)}`);
                
                // Store for persistence
                try {
                  localStorage.setItem('mixmi-wallet-connected', 'true');
                  localStorage.setItem('mixmi-wallet-address', address);
                  localStorage.setItem('mixmi-last-auth-check', new Date().toISOString());
                } catch (e) {
                  console.error('Error saving connection data:', e);
                }
                
                // Refresh auth state to update UI
                refreshAuthState();
                setTimeout(() => {
                  setIsLoading(false);
                  refreshAuthState();
                }, 1000);
              } else {
                setDebugMessage('Connection completed but not signed in');
                setIsLoading(false);
              }
            },
            userSession,
          });
          
          return; // Don't set isLoading=false yet
        } catch (error) {
          console.error('Error connecting wallet:', error);
          setDebugMessage(`Connection error: ${error}`);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error in login toggle:', error);
      setDebugMessage(`Error: ${error}`);
      setIsLoading(false);
    }
  }, [isAuthenticated, connectWallet, disconnectWallet, refreshAuthState, devMode]);
  
  // Function to directly test wallet connection without any dev mode overrides
  const directWalletTest = useCallback(async () => {
    try {
      setDebugMessage('Testing direct wallet connection...');
      
      if (typeof window === 'undefined' || !window.document) {
        setDebugMessage('Not in browser environment');
        return;
      }
      
      // @ts-ignore
      if (!window.StacksProvider) {
        setDebugMessage('Hiro Wallet extension not detected');
        if (window.confirm('Hiro Wallet extension not detected. Install it?')) {
          window.open('https://wallet.hiro.so/download', '_blank');
        }
        return;
      }
      
      setDebugMessage('Wallet extension detected, attempting connection...');
      
      // Using the standard connect options directly
      const { showConnect, AppConfig, UserSession } = await import('@stacks/connect');
      const appConfig = new AppConfig(['store_write']);
      const uSession = new UserSession({ appConfig });
      
      showConnect({
        appDetails: {
          name: 'Mixmi Test',
          icon: window.location.origin + '/favicon.ico',
        },
        redirectTo: window.location.origin,
        onFinish: () => {
          setDebugMessage('Direct wallet connection completed! Checking session...');
          if (uSession.isUserSignedIn()) {
            const userData = uSession.loadUserData();
            setDebugMessage(`Connected! Address: ${userData.profile.stxAddress.mainnet}`);
          } else {
            setDebugMessage('Connection completed but user is not signed in');
          }
        },
        userSession: uSession,
      });
      
    } catch (error) {
      console.error('Error in direct wallet test:', error);
      setDebugMessage(`Error in direct test: ${error}`);
    }
  }, []);
  
  // Clear periodic auth refresh interval on unmount
  useEffect(() => {
    let checkInterval: ReturnType<typeof setInterval> | null = null;
    
    if (!isAuthenticated && isInitialized) {
      checkInterval = setInterval(() => {
        refreshAuthState();
      }, 2000);
    }
    
    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [isAuthenticated, refreshAuthState, isInitialized]);
  
  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLoginToggle={handleLoginToggle}
        statusMessage={debugMessage || undefined}
      />
      
      {/* Debug button - always visible in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setShowDebug(prev => !prev)}
          className="fixed bottom-4 right-4 z-50 bg-gray-700 text-white px-3 py-2 rounded-full shadow-lg hover:bg-gray-600"
        >
          {showDebug ? 'Hide Debug' : 'Debug'}
        </button>
      )}
      
      {/* Debug overlay - toggle with Alt+D */}
      {showDebug && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 text-white p-4 text-sm font-mono">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Debug Info (Press Alt+D to hide)</h3>
            <button 
              onClick={() => setShowDebug(false)}
              className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
          <div className="mt-2 space-y-1">
            <p>Auth State: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
            <p>Initialized: {isInitialized ? '✅ Yes' : '⏳ No'}</p>
            <p>Loading: {isLoading ? '⏳ Yes' : '✅ No'}</p>
            {debugMessage && <p className="text-yellow-300">{debugMessage}</p>}
            
            <div className="mt-2 flex space-x-2">
              <button
                onClick={directWalletTest}
                className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
              >
                Direct Wallet Test
              </button>
              <button
                onClick={() => window.location.href = 'https://wallet.hiro.so/download'}
                className="px-2 py-1 bg-green-600 rounded hover:bg-green-700"
              >
                Get Hiro Wallet
              </button>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400">Local Storage Auth Keys:</p>
              <div className="mt-1 text-xs max-h-20 overflow-y-auto">
                {typeof window !== 'undefined' && 
                  Object.keys(localStorage)
                    .filter(key => 
                      key.includes('blockstack') || 
                      key.includes('stacks') ||
                      key.includes('authResponse') ||
                      key.includes('mixmi')
                    )
                    .map(key => (
                      <div key={key} className="flex justify-between">
                        <span>{key}</span>
                        <span className="opacity-70">{localStorage.getItem(key)?.slice(0, 15)}...</span>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 