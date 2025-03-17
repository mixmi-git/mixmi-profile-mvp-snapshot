import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

export const useAuthState = (onConnect?: (address: string) => void) => {
  const { 
    isAuthenticated, 
    userAddress, 
    connectWallet, 
    disconnectWallet,
    isInitialized
  } = useAuth();
  
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Effect to call onConnect when authentication state changes
  useEffect(() => {
    if (isAuthenticated && userAddress && onConnect) {
      onConnect(userAddress);
    }
  }, [isAuthenticated, userAddress, onConnect]);

  const handleLoginToggle = useCallback(() => {
    setIsTransitioning(true);
    
    if (isAuthenticated) {
      disconnectWallet();
      setTimeout(() => setIsTransitioning(false), 500);
    } else {
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
    handleLoginToggle
  };
}; 