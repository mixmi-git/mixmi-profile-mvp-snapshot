import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { useCallback, useEffect, useState } from 'react'

// Add interface for Stacks user data
interface StacksUserData {
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
  };
}

// Extend UserSession type to include loadUserData
declare module '@stacks/connect' {
  interface UserSession {
    isSignInPending(): boolean;
    handlePendingSignIn(): Promise<StacksUserData>;
    isUserSignedIn(): boolean;
    loadUserData(): StacksUserData;
    signUserOut(redirectTo: string): void;
  }
}

// Create a single instance of UserSession to use across the app
const appConfig = new AppConfig(['store_write'])
const userSession = new UserSession({ appConfig })

// Simplified function to check local storage for session data
function checkLocalStorageForSession() {
  if (typeof window === 'undefined') return false;
  
  try {
    const sessionData = localStorage.getItem('blockstack-session');
    if (sessionData) {
      console.log('Auth: Found session data in localStorage');
      return true;
    }
    return false;
  } catch (e) {
    console.error('Auth: Error checking localStorage', e);
    return false;
  }
}

// Global state to track connection attempts
let connectionInProgress = false;
let connectionAttemptTimestamp = 0;

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  // Force component to re-render when needed
  const [refreshCounter, setRefreshCounter] = useState(0)

  // Function to check auth status and update state
  const checkAuthStatus = useCallback(() => {
    try {
      // First check: is the user signed in according to userSession
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData()
        console.log('Auth: User is signed in via session', userData)
        setIsAuthenticated(true)
        setUserAddress(userData.profile.stxAddress.mainnet)
        return;
      }
      
      // Second check: If we see session data in localStorage but userSession doesn't recognize it
      if (checkLocalStorageForSession()) {
        console.log('Auth: Session data found in localStorage but isUserSignedIn() returns false')
        
        try {
          // Try to manually get user data from localStorage session
          const sessionData = localStorage.getItem('blockstack-session');
          if (sessionData) {
            const parsedSession = JSON.parse(sessionData);
            if (parsedSession && parsedSession.userData && parsedSession.userData.profile) {
              console.log('Auth: Manually extracted user data from localStorage session', parsedSession.userData);
              setIsAuthenticated(true);
              
              // Try to extract address from the parsed session
              const address = parsedSession.userData.profile?.stxAddress?.mainnet;
              if (address) {
                setUserAddress(address);
                return;
              }
            }
          }
        } catch (e) {
          console.error('Auth: Error parsing localStorage session data', e);
        }
      }
      
      // Third check: If we already have a userAddress set but isUserSignedIn is false
      // This handles edge cases where the session might not be detected but we know the user is connected
      if (userAddress) {
        console.log('Auth: User address exists but session not detected, keeping authenticated state');
        setIsAuthenticated(true);
        return;
      }
      
      // If none of the above checks pass, the user is not authenticated
      console.log('Auth: User is NOT signed in')
      setIsAuthenticated(false)
      setUserAddress(null)
    } catch (error) {
      console.error('Auth: Error checking auth status', error)
      setIsAuthenticated(false)
      setUserAddress(null)
    }
    setIsInitialized(true)
  }, [userAddress])

  // Force a refresh of the component state
  const forceRefresh = useCallback(() => {
    setRefreshCounter(prev => prev + 1)
  }, [])

  // Check for pending sign-ins and initialize auth state
  useEffect(() => {
    console.log('Auth: Initializing auth state')
    
    // Set a timeout to ensure we don't get stuck in loading state
    const initTimeout = setTimeout(() => {
      if (!isInitialized) {
        console.log('Auth: Forcing initialization after timeout')
        setIsInitialized(true)
      }
    }, 2000)
    
    // Check if there's a pending sign-in to handle
    if (userSession.isSignInPending()) {
      console.log('Auth: Found pending sign-in, handling...')
      userSession.handlePendingSignIn()
        .then(userData => {
          console.log('Auth: Successfully handled pending sign-in', userData)
          setIsAuthenticated(true)
          setUserAddress(userData.profile.stxAddress.mainnet)
          setIsInitialized(true)
          clearTimeout(initTimeout)
        })
        .catch(error => {
          console.error('Auth: Error handling pending sign-in', error)
          setIsInitialized(true)
          clearTimeout(initTimeout)
        })
    } else {
      // No pending sign-in, just check current status
      checkAuthStatus()
      clearTimeout(initTimeout)
    }
    
    return () => {
      clearTimeout(initTimeout)
    }
  }, [checkAuthStatus, refreshCounter])

  // Add a polling mechanism to check for recent authentication
  useEffect(() => {
    // Only set up polling if we're actively trying to connect
    if (!connectionInProgress) return;
    
    console.log('Auth: Setting up connection polling');
    const pollInterval = setInterval(() => {
      // Stop polling if it's been more than 30 seconds since connection attempt
      const currentTime = Date.now();
      if (currentTime - connectionAttemptTimestamp > 30000) {
        console.log('Auth: Connection polling timeout reached');
        connectionInProgress = false;
        clearInterval(pollInterval);
        return;
      }

      console.log('Auth: Polling for authentication state...');
      // Re-check auth status
      try {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          console.log('Auth: Polling detected successful sign-in!', userData);
          setIsAuthenticated(true);
          setUserAddress(userData.profile.stxAddress.mainnet);
          connectionInProgress = false;
          clearInterval(pollInterval);
        } else if (checkLocalStorageForSession()) {
          console.log('Auth: Polling found session data in localStorage');
          // Force a refresh to trigger a re-render and state re-check
          forceRefresh();
        }
      } catch (error) {
        console.error('Auth: Error during auth polling', error);
      }
    }, 1000); // Check every second
    
    return () => clearInterval(pollInterval);
  }, [checkAuthStatus, forceRefresh, refreshCounter]);

  const connectWallet = useCallback(() => {
    console.log('Auth: Connecting wallet...')
    
    // Check if already signed in first
    if (userSession.isUserSignedIn()) {
      console.log('Auth: User is already signed in')
      checkAuthStatus() // Update state to reflect this
      return
    }
    
    // Mark that we're attempting a connection
    connectionInProgress = true;
    connectionAttemptTimestamp = Date.now();
    
    // Attempt to show the connect dialog
    try {
      showConnect({
        appDetails: {
          name: 'Mixmi',
          icon: window.location.origin + '/favicon.ico',
        },
        redirectTo: window.location.origin,
        onFinish: () => {
          console.log('Auth: onFinish callback triggered')
          
          // Allow time for the session to be fully established
          setTimeout(() => {
            try {
              // Check if the user is now signed in
              if (userSession.isUserSignedIn()) {
                const userData = userSession.loadUserData()
                console.log('Auth: User signed in via onFinish:', userData)
                setIsAuthenticated(true)
                setUserAddress(userData.profile.stxAddress.mainnet)
              } else {
                console.log('Auth: User still not signed in after onFinish')
                // Check if we have session data in localStorage that the userSession doesn't recognize
                if (checkLocalStorageForSession()) {
                  console.log('Auth: Found session in localStorage after onFinish')
                  // Force a refresh to trigger a component update
                  forceRefresh()
                }
              }
            } catch (error) {
              console.error('Auth: Error in onFinish timeout handler', error)
            } finally {
              // We're done with this connection attempt regardless of result
              connectionInProgress = false
            }
          }, 500)
        },
        userSession,
      })
      
      // After showing connect, trigger a state refresh to start polling
      forceRefresh()
    } catch (error) {
      console.error('Auth: Error showing connect dialog', error)
      connectionInProgress = false
    }
  }, [checkAuthStatus, forceRefresh])

  const disconnectWallet = useCallback(() => {
    console.log('Auth: Disconnecting wallet...')
    try {
      // First, sign the user out using the userSession
      userSession.signUserOut('')  // Pass an empty string to prevent redirection issues
      
      // Force-clear the authentication state
      setIsAuthenticated(false)
      setUserAddress(null)
      
      // Additional cleanup: clear any potential Stacks-related localStorage items
      if (typeof window !== 'undefined') {
        console.log('Auth: Clearing localStorage items')
        try {
          // Clear the blockstack-session directly
          localStorage.removeItem('blockstack-session')
          
          // Find and clear any other Stacks-related items
          const stacksKeys = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && (
              key.toLowerCase().includes('stacks') || 
              key.toLowerCase().includes('blockstack') ||
              key.toLowerCase().includes('gaia')
            )) {
              stacksKeys.push(key)
            }
          }
          
          // Remove all identified keys
          stacksKeys.forEach(key => {
            console.log(`Auth: Removing localStorage key: ${key}`)
            localStorage.removeItem(key)
          })
          
          console.log(`Auth: Cleared ${stacksKeys.length} Stacks-related localStorage items`)
        } catch (e) {
          console.error('Auth: Error clearing localStorage:', e)
        }
      }
      
      console.log('Auth: Wallet disconnected!')
      
      // Force a refresh to ensure UI updates
      setTimeout(() => {
        forceRefresh() // Ensure UI updates after disconnect
        // Double-check auth status after a short delay
        setTimeout(() => checkAuthStatus(), 500)
      }, 100)
    } catch (error) {
      console.error('Auth: Error disconnecting wallet', error)
    }
  }, [forceRefresh, checkAuthStatus])

  // Function to manually refresh auth state - useful for testing
  const refreshAuthState = useCallback(() => {
    console.log('Auth: Manually refreshing auth state')
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    isAuthenticated,
    userAddress,
    connectWallet,
    disconnectWallet,
    refreshAuthState,
    isInitialized
  }
}