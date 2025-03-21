import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

// Create a debug flag that can be toggled from the browser console
// and expose it to the window for access from other components
if (typeof window !== 'undefined') {
  (window as any).DEBUG_AUTH = false;
  
  (window as any).toggleAuthDebug = () => {
    (window as any).DEBUG_AUTH = !(window as any).DEBUG_AUTH;
    console.log(`Auth debugging ${(window as any).DEBUG_AUTH ? 'enabled' : 'disabled'}`);
    return (window as any).DEBUG_AUTH;
  };
}

export const useAuthState = (onConnect?: (address: string) => void) => {
  const { 
    isAuthenticated, 
    userAddress, 
    connectWallet, 
    disconnectWallet,
    isInitialized,
    availableAccounts,
    currentAccount,
    switchAccount,
    getProfileIdForAddress
  } = useAuth();
  
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced debugging
  const logAuthState = (context: string) => {
    if (typeof window !== 'undefined' && (window as any).DEBUG_AUTH) {
      console.group(`🔐 Auth State [${context}]`);
      console.log('isAuthenticated:', isAuthenticated);
      console.log('userAddress:', userAddress);
      console.log('currentAccount:', currentAccount);
      console.log('availableAccounts:', availableAccounts);
      console.log('isTransitioning:', isTransitioning);
      console.log('isInitialized:', isInitialized);
      console.groupEnd();
    }
  };

  // Log initial state and any changes
  useEffect(() => {
    logAuthState('state-change');
  }, [isAuthenticated, userAddress, isTransitioning, isInitialized, currentAccount, availableAccounts]);

  // Effect to call onConnect when authentication state changes
  useEffect(() => {
    if (isAuthenticated && userAddress && onConnect) {
      if (typeof window !== 'undefined' && (window as any).DEBUG_AUTH) console.log('📱 Calling onConnect with address:', userAddress);
      onConnect(userAddress);
    }
  }, [isAuthenticated, userAddress, onConnect]);

  const handleLoginToggle = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).DEBUG_AUTH) console.log(`🔄 Login toggle called, current auth state: ${isAuthenticated ? 'authenticated' : 'not authenticated'}`);
    setIsTransitioning(true);
    
    if (isAuthenticated) {
      if (typeof window !== 'undefined' && (window as any).DEBUG_AUTH) console.log('🔓 Disconnecting wallet');
      disconnectWallet();
      setTimeout(() => setIsTransitioning(false), 500);
    } else {
      if (typeof window !== 'undefined' && (window as any).DEBUG_AUTH) console.log('🔒 Connecting wallet');
      connectWallet();
      
      // Set a timeout to reset the transitioning state in case connection takes too long
      // This prevents the button from being disabled indefinitely
      setTimeout(() => setIsTransitioning(false), 3000);
    }
  }, [isAuthenticated, connectWallet, disconnectWallet]);

  return {
    isAuthenticated,
    userAddress,
    isTransitioning,
    isInitialized,
    handleLoginToggle,
    availableAccounts,
    currentAccount,
    switchAccount,
    getProfileIdForAddress
  };
}; 