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

const appConfig = new AppConfig(['store_write'])
const userSession = new UserSession({ appConfig })

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is signed in on mount
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      setIsAuthenticated(true)
      setUserAddress(userData.profile.stxAddress.mainnet)
    }
  }, [])

  const connectWallet = useCallback(async () => {
    showConnect({
      appDetails: {
        name: 'Mixmi',
        icon: window.location.origin + '/favicon.ico',
      },
      onFinish: () => {
        const userData = userSession.loadUserData()
        setIsAuthenticated(true)
        setUserAddress(userData.profile.stxAddress.mainnet)
      },
      userSession,
    })
  }, [])

  const disconnectWallet = useCallback(() => {
    userSession.signUserOut()
    setIsAuthenticated(false)
    setUserAddress(null)
  }, [])

  return {
    isAuthenticated,
    userAddress,
    connectWallet,
    disconnectWallet
  }
}