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

// Sample wallet address for testing purposes
const DEMO_WALLET_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

/**
 * Simple authentication hook to manage wallet connection state
 * This is a placeholder implementation that will be replaced with real wallet connectivity
 */
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  /**
   * Connect wallet function
   * Currently just sets the login state to true
   */
  const connectWallet = async () => {
    // In a real implementation, this would trigger a wallet connection request
    setIsLoggedIn(true);
    return true;
  };
  
  /**
   * Disconnect wallet function
   * Currently just sets the login state to false
   */
  const disconnectWallet = async () => {
    // In a real implementation, this would disconnect from the wallet
    setIsLoggedIn(false);
    return true;
  };
  
  return {
    isAuthenticated: isLoggedIn,
    userAddress: isLoggedIn ? DEMO_WALLET_ADDRESS : '',
    connectWallet,
    disconnectWallet,
  };
}