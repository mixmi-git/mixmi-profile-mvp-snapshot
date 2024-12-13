import { useState, useEffect } from 'react'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'

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

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData: StacksUserData) => {
        setIsAuthenticated(true)
        setUserAddress(userData.profile.stxAddress.mainnet)
      })
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      setIsAuthenticated(true)
      setUserAddress(userData.profile.stxAddress.mainnet)
    }
  }, [])

  const connectWallet = async () => {
    showConnect({
      appDetails: {
        name: 'Mixmi Profile',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        setIsAuthenticated(true)
        window.location.reload()
      },
      userSession,
    })
  }

  const disconnectWallet = async () => {
    userSession.signUserOut('/')
    setIsAuthenticated(false)
    setUserAddress(null)  // Clear the address on disconnect
  }

  return {
    isAuthenticated,
    userAddress,
    connectWallet,
    disconnectWallet
  }
}