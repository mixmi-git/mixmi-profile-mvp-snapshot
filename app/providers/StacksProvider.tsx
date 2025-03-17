'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksNetwork, STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

interface StacksContextType {
  userSession: UserSession | null;
  isSignedIn: boolean;
  handleSignIn: () => void;
  handleSignOut: () => void;
  userData: any | null;
  network: StacksNetwork;
}

// Default values provided to avoid undefined errors
const StacksContext = createContext<StacksContextType>({
  userSession: null,
  isSignedIn: false,
  handleSignIn: () => {},
  handleSignOut: () => {},
  userData: null,
  network: STACKS_MAINNET,
});

// Use testnet for development, mainnet for production
const network = process.env.NODE_ENV === 'production' 
  ? STACKS_MAINNET 
  : STACKS_TESTNET;

export const StacksProvider = ({ children }: { children: ReactNode }) => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Initialize app on first load
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    const userSession = new UserSession({ appConfig });
    
    setUserSession(userSession);
    
    if (userSession.isUserSignedIn()) {
      setIsSignedIn(true);
      setUserData(userSession.loadUserData());
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Stacks user is already signed in', userSession.loadUserData());
      }
    } else {
      setIsSignedIn(false);
      setUserData(null);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Stacks user is not signed in');
      }
    }
  }, []);

  const handleSignIn = () => {
    if (!userSession) return;
    
    showConnect({
      appDetails: {
        name: 'Mixmi Profile',
        icon: window.location.origin + '/images/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        setIsSignedIn(true);
        setUserData(userSession.loadUserData());
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Stacks user signed in', userSession.loadUserData());
        }
        
        // Refresh the page to update UI state after authentication
        window.location.reload();
      },
      userSession,
    });
  };

  const handleSignOut = () => {
    if (!userSession) return;
    
    userSession.signUserOut('');
    setIsSignedIn(false);
    setUserData(null);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Stacks user signed out');
    }
    
    // Refresh the page to update UI state after sign out
    window.location.reload();
  };

  return (
    <StacksContext.Provider
      value={{
        userSession,
        isSignedIn,
        handleSignIn,
        handleSignOut,
        userData,
        network,
      }}
    >
      {children}
    </StacksContext.Provider>
  );
};

// Custom hook to use the Stacks context
export const useStacks = (): StacksContextType => useContext(StacksContext); 