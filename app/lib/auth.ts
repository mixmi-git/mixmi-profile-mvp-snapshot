import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { useCallback, useEffect, useState } from 'react'

// Add interface for Stacks user data
interface StacksUserData {
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
    // Add a property to store the currently selected account
    currentAccount?: string;
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

// Helper function to check for session data in localStorage
const checkLocalStorageForSession = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const sessionData = localStorage.getItem('blockstack-session');
    return !!sessionData;
  } catch (error) {
    console.error('Error checking localStorage for session:', error);
    return false;
  }
};

// Helper function to check if Stacks wallet is installed
const checkHasStacksWallet = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    // @ts-ignore - window.StacksProvider is added by the Stacks wallet
    return !!window.StacksProvider;
  } catch (error) {
    console.error('Error checking for Stacks wallet:', error);
    return false;
  }
};

// Global state to track connection attempts
let connectionInProgress = false;
let connectionAttemptTimestamp = 0;

// Helper function to get the current account from the Stacks wallet
const getCurrentAccount = async (userSession: UserSession): Promise<string[]> => {
  if (typeof window === 'undefined') return [];
  
  try {
    // @ts-ignore - window.StacksProvider is added by the Stacks wallet
    if (window.StacksProvider) {
      // @ts-ignore
      const accounts = await window.StacksProvider.getAccounts?.();
      return accounts && accounts.length > 0 ? accounts : [];
    }
    return [];
  } catch (error) {
    console.error('Error getting current account from Stacks wallet:', error);
    return [];
  }
};

// Add storage key for account profile mapping
const ACCOUNT_PROFILE_MAP_KEY = 'mixmi_account_profile_map';

// Helper function to get the profile ID for a specific wallet address
export const getProfileIdForAddress = (address: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Get the account-to-profile mapping from localStorage
    const mapString = localStorage.getItem(ACCOUNT_PROFILE_MAP_KEY);
    const map = mapString ? JSON.parse(mapString) : {};
    
    // Return the profile ID for this address, or null if not found
    return map[address] || null;
  } catch (error) {
    console.error('Error getting profile ID for address:', error);
    return null;
  }
};

// Helper function to associate a wallet address with a profile ID
export const setProfileIdForAddress = (address: string, profileId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Get the current mapping
    const mapString = localStorage.getItem(ACCOUNT_PROFILE_MAP_KEY);
    const map = mapString ? JSON.parse(mapString) : {};
    
    // Add or update the mapping
    map[address] = profileId;
    
    // Save back to localStorage
    localStorage.setItem(ACCOUNT_PROFILE_MAP_KEY, JSON.stringify(map));
  } catch (error) {
    console.error('Error setting profile ID for address:', error);
  }
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      console.log("🔌 Connecting wallet...");
      
      // Check if already signed in
      if (userSession.isUserSignedIn()) {
        console.log("👤 User already signed in");
        userSession.signUserOut('');
      }

      // Use showConnect from @stacks/connect instead of openSTXConnect
      showConnect({
        appDetails: {
          name: 'Mixmi',
          icon: window.location.origin + '/favicon.ico',
        },
        redirectTo: window.location.origin,
        onFinish: () => {
          console.log('Auth: onFinish callback triggered');
          
          // Allow time for the session to be fully established
          setTimeout(() => {
            try {
              // Check if the user is now signed in
              if (userSession.isUserSignedIn()) {
                const userData = userSession.loadUserData();
                console.log('✅ Wallet connected:', userData);
                setIsAuthenticated(true);
                setUserAddress(userData.profile.stxAddress.mainnet);
                
                // Try to get available accounts from the wallet
                try {
                  // @ts-ignore
                  if (window?.StacksProvider?.getAccounts) {
                    // @ts-ignore
                    const accounts = window.StacksProvider.getAccounts();
                    if (accounts && accounts.length > 0) {
                      setAvailableAccounts(accounts);
                      setCurrentAccount(accounts[0]);
                    } else {
                      setAvailableAccounts([userData.profile.stxAddress.mainnet]);
                      setCurrentAccount(userData.profile.stxAddress.mainnet);
                    }
                  } else {
                    setAvailableAccounts([userData.profile.stxAddress.mainnet]);
                    setCurrentAccount(userData.profile.stxAddress.mainnet);
                  }
                } catch (error) {
                  console.error('Error getting accounts from provider:', error);
                  setAvailableAccounts([userData.profile.stxAddress.mainnet]);
                  setCurrentAccount(userData.profile.stxAddress.mainnet);
                }
              }
            } catch (error) {
              console.error('Error in onFinish timeout handler', error);
            }
          }, 500);
        },
        userSession,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }, []);

  // Make sure to console log when authentication state changes
  useEffect(() => {
    console.log("🔐 Auth state changed:", { 
      isAuthenticated, 
      userAddress,
      availableAccounts,
      currentAccount
    });
  }, [isAuthenticated, userAddress, availableAccounts, currentAccount]);

  // Add state for available accounts
  const [refreshCounter, setRefreshCounter] = useState(0)

  // Function to check auth status and update state
  const checkAuthStatus = useCallback(async () => {
    try {
      // First check: is the user signed in according to userSession
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData()
        console.log('Auth: User is signed in via session', userData)
        setIsAuthenticated(true)
        
        // Get the mainnet address from user data
        const mainnetAddress = userData.profile.stxAddress.mainnet
        setUserAddress(mainnetAddress)
        
        // Try to get the current account from the wallet - handle async properly
        try {
          const accounts = await getCurrentAccount(userSession)
          setCurrentAccount(accounts && accounts.length > 0 ? accounts[0] : null)
        } catch (accountError) {
          console.error('Error getting current account:', accountError)
          // Fallback to mainnet address
          setCurrentAccount(mainnetAddress)
        }
        
        // Update the profile ID mapping if needed
        const profileId = getProfileIdForAddress(mainnetAddress)
        if (!profileId) {
          // Create a new profile ID and associate it with this address
          const newProfileId = `profile_${Date.now()}`
          setProfileIdForAddress(mainnetAddress, newProfileId)
        }
        
        return
      }
      
      // Second check: look for blockstack-session data in localStorage
      if (typeof window !== 'undefined') {
        try {
          // Check when the last auth check was performed
          const lastAuthCheck = localStorage.getItem('mixmi-last-auth-check');
          const sessionData = localStorage.getItem('blockstack-session');
          
          // Check if we have recently verified auth status (within 10 minutes)
          const recentCheck = lastAuthCheck && 
            (new Date().getTime() - new Date(lastAuthCheck).getTime() < 10 * 60 * 1000);
          
          if (sessionData && (recentCheck || checkLocalStorageForSession())) {
            console.log('Auth: Found session data in localStorage');
            
            try {
              const parsed = JSON.parse(sessionData);
              if (parsed && parsed.userData && parsed.userData.profile) {
                const address = parsed.userData.profile.stxAddress?.mainnet;
                
                if (address) {
                  console.log('Auth: Restoring auth state from localStorage session');
                  setIsAuthenticated(true);
                  setUserAddress(address);
                  setCurrentAccount(address);
                  return;
                }
              }
            } catch (e) {
              console.error('Error parsing localStorage session:', e);
            }
          }
        } catch (e) {
          console.error('Auth: Error reading from localStorage:', e);
        }
      }
      
      // Third check: If we already have a userAddress set but isUserSignedIn is false
      // This handles edge cases where the session might not be detected but we know the user is connected
      if (userAddress) {
        console.log('Auth: User address exists but session not detected, keeping authenticated state');
        setIsAuthenticated(true);
        setCurrentAccount(userAddress);
        return;
      }
      
      // If none of the above checks pass, the user is not authenticated
      console.log('Auth: User is NOT signed in')
      setIsAuthenticated(false)
      setUserAddress(null)
      setCurrentAccount(null)
    } catch (error) {
      console.error('Auth: Error checking auth status', error)
      setIsAuthenticated(false)
      setUserAddress(null)
      setCurrentAccount(null)
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
          setCurrentAccount(userData.profile.stxAddress.mainnet)
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
      checkAuthStatus().catch(err => {
        console.error('Error checking auth status:', err);
        setIsInitialized(true);
      });
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
          setCurrentAccount(userData.profile.stxAddress.mainnet);
          connectionInProgress = false;
          clearInterval(pollInterval);
        } else if (checkLocalStorageForSession()) {
          console.log('Auth: Polling found session data in localStorage');
          // Force a refresh to trigger a re-render and state re-check
          forceRefresh()
        }
      } catch (error) {
        console.error('Auth: Error during auth polling', error);
      }
    }, 1000); // Check every second
    
    return () => clearInterval(pollInterval);
  }, [checkAuthStatus, forceRefresh, refreshCounter]);

  const disconnectWallet = useCallback(() => {
    console.log('Auth: Disconnecting wallet...')
    try {
      // First clear all session data
      userSession.signUserOut('')  // Pass an empty string to prevent redirection issues
      
      // Manually clear any local storage data related to sessions
      if (typeof window !== 'undefined') {
        // Clear specific auth-related items
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.includes('blockstack') || 
          key.includes('stacks') ||
          key.includes('authResponse')
        );
        
        console.log('Auth: Clearing session data from localStorage:', keysToRemove);
        keysToRemove.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            console.error(`Error removing ${key}:`, e);
          }
        });
      }
      
      // Reset auth state
      setIsAuthenticated(false)
      setUserAddress(null)
      setCurrentAccount(null)
      
      // Force refresh to ensure UI updates
      setTimeout(() => {
        forceRefresh() // Ensure UI updates after disconnect
        console.log('Auth: Wallet disconnected and state refreshed!')
      }, 100);
    } catch (error) {
      console.error('Auth: Error disconnecting wallet', error)
      
      // Attempt recovery in case of failure
      setIsAuthenticated(false)
      setUserAddress(null)
      setCurrentAccount(null)
      forceRefresh()
    }
  }, [forceRefresh])

  // Function to manually refresh auth state - useful for testing
  const refreshAuthState = useCallback(() => {
    console.log('Auth: Manually refreshing auth state')
    checkAuthStatus().catch(err => {
      console.error('Error during manual auth refresh:', err);
    });
  }, [checkAuthStatus])

  // Make refreshAuthState globally available for other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshAuthState = refreshAuthState;
    }
    
    return () => {
      // Clean up when component unmounts
      if (typeof window !== 'undefined') {
        delete (window as any).refreshAuthState;
      }
    };
  }, [refreshAuthState]);

  // Function to switch between accounts
  const switchAccount = useCallback((accountAddress: string) => {
    console.log('Auth: Switching to account', accountAddress);
    
    if (isAuthenticated && userAddress) {
      // Update the current account in state
      setCurrentAccount(accountAddress);
      
      // Check if this account has a profile ID
      const profileId = getProfileIdForAddress(accountAddress);
      if (!profileId) {
        // Create a new profile ID for this account
        const newProfileId = `profile_${Date.now()}`;
        setProfileIdForAddress(accountAddress, newProfileId);
      }
      
      // Force a refresh to update the UI
      forceRefresh();
    }
  }, [isAuthenticated, userAddress, forceRefresh]);

  // Update available accounts when authenticated
  useEffect(() => {
    if (isAuthenticated && userAddress) {
      try {
        // Try to get available accounts from the wallet
        // @ts-ignore
        if (window.StacksProvider && window.StacksProvider.getAccounts) {
          // @ts-ignore
          const accounts = window.StacksProvider.getAccounts();
          if (accounts && accounts.length > 0) {
            setAvailableAccounts(accounts);
            
            // Set current account if not already set
            if (!currentAccount) {
              setCurrentAccount(accounts[0]);
            }
          } else {
            // Fallback to just the main address
            setAvailableAccounts([userAddress]);
            
            // Set current account if not already set
            if (!currentAccount) {
              setCurrentAccount(userAddress);
            }
          }
        } else {
          // Fallback to just the main address
          setAvailableAccounts([userAddress]);
          
          // Set current account if not already set
          if (!currentAccount) {
            setCurrentAccount(userAddress);
          }
        }
      } catch (error) {
        console.error('Auth: Error getting available accounts', error);
        // Fallback to just the main address
        setAvailableAccounts([userAddress]);
        
        // Set current account if not already set
        if (!currentAccount) {
          setCurrentAccount(userAddress);
        }
      }
    } else {
      setAvailableAccounts([]);
      setCurrentAccount(null);
    }
  }, [isAuthenticated, userAddress, currentAccount]);

  return {
    isAuthenticated,
    userAddress,
    connectWallet,
    disconnectWallet,
    refreshAuthState,
    isInitialized,
    availableAccounts,
    currentAccount,
    switchAccount,
    getProfileIdForAddress,
  }
}