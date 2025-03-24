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
            key.includes('mixmi-last-auth-check')) &&
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
        setDebugMessage('Connecting wallet... Please check for the Hiro Wallet popup.');
        try {
          await connectWallet();
          console.log('✅ Connect wallet call completed');
          setDebugMessage('Wallet connect attempt completed.');
          
          // Force refresh auth state after connection
          setTimeout(() => {
            console.log('🔄 First refresh auth state call');
            setDebugMessage('Refreshing authentication...');
            refreshAuthState();
          }, 1000);
          
          // Also do a second refresh after a longer delay to catch any delayed updates
          setTimeout(() => {
            console.log('🔄 Performing delayed auth refresh check');
            setDebugMessage('Performing final auth check...');
            refreshAuthState();
            
            // Store auth status in localStorage for persistence across page refreshes
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('mixmi-last-auth-check', new Date().toISOString());
                console.log('✅ Set auth check timestamp');
              } catch (e) {
                console.error('Failed to update auth check timestamp:', e);
              }
            }
          }, 3000);
        } catch (connectError) {
          console.error('⚠️ Error connecting wallet:', connectError);
          setDebugMessage(`Error connecting: ${connectError}`);
        }
      }
      
      // Set a timeout to reset loading state if connection takes too long
      setTimeout(() => {
        console.log('⏱️ Resetting loading state');
        setIsLoading(false);
        setDebugMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error in login toggle:', error);
      setDebugMessage(`Error: ${error}`);
      setIsLoading(false);
    }
  }, [isAuthenticated, connectWallet, disconnectWallet, refreshAuthState]);
  
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