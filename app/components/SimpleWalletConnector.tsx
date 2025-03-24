'use client';

import React, { useState, useEffect, useCallback } from 'react';

export function SimpleWalletConnector() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Check localStorage on mount for existing connection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const connected = localStorage.getItem('simple-wallet-connected') === 'true';
      const address = localStorage.getItem('simple-wallet-address');
      
      if (connected && address) {
        setIsAuthenticated(true);
        setUserAddress(address);
        console.log('✅ Restored wallet connection from localStorage:', address);
      }
    }
  }, []);
  
  // Direct connect function using just the Leather provider
  const connectWallet = useCallback(async () => {
    if (isAuthenticated) {
      // Handle disconnect
      setIsLoading(true);
      setStatusMessage('Disconnecting wallet...');
      
      try {
        // Clear localStorage
        localStorage.removeItem('simple-wallet-connected');
        localStorage.removeItem('simple-wallet-address');
        
        setIsAuthenticated(false);
        setUserAddress(null);
        setStatusMessage('Wallet disconnected');
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        setStatusMessage(`Error disconnecting: ${error}`);
      } finally {
        setIsLoading(false);
      }
      
      return;
    }
    
    // Connect flow
    setIsLoading(true);
    setStatusMessage('Checking for wallet...');
    
    if (typeof window === 'undefined') {
      setStatusMessage('Not in browser environment');
      setIsLoading(false);
      return;
    }
    
    try {
      // Use the simpler, more direct connection method
      setStatusMessage('Preparing wallet connection...');
      
      // Dynamically import minimal dependencies
      const { showConnect, AppConfig, UserSession } = await import('@stacks/connect');
      const appConfig = new AppConfig(['store_write']);
      const userSession = new UserSession({ appConfig });
      
      setStatusMessage('Showing wallet dialog. Please check your browser extensions...');
      
      showConnect({
        appDetails: {
          name: 'Mixmi Simple',
          icon: '/favicon.ico',
        },
        redirectTo: window.location.origin,
        onFinish: () => {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const address = userData.profile.stxAddress.mainnet;
            
            setIsAuthenticated(true);
            setUserAddress(address);
            setStatusMessage(`Connected! Address: ${address.slice(0, 6)}...${address.slice(-4)}`);
            
            // Store in localStorage
            localStorage.setItem('simple-wallet-connected', 'true');
            localStorage.setItem('simple-wallet-address', address);
          } else {
            setStatusMessage('Connection completed but not signed in');
          }
          setIsLoading(false);
        },
        userSession,
      });
      
      return; // Don't set isLoading=false yet
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setStatusMessage(`Connection error: ${error}`);
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  return (
    <div className="p-6 bg-gray-800 rounded-lg max-w-lg mx-auto mt-10 text-white">
      <h2 className="text-xl font-bold mb-4">Simple Wallet Connection</h2>
      
      <div className="mb-6">
        <p className="mb-2">Status: {isAuthenticated ? '✅ Connected' : '❌ Disconnected'}</p>
        {userAddress && (
          <p className="mb-2 font-mono text-sm">
            Address: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </p>
        )}
        {statusMessage && <p className="text-sm text-blue-400 mt-2">{statusMessage}</p>}
      </div>
      
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md font-medium transition ${
          isAuthenticated
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-blue-600 hover:bg-blue-700'
        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : isAuthenticated ? 'Disconnect Wallet' : 'Connect Wallet'}
      </button>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>This is a simplified wallet connector that directly uses wallet providers.</p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Wallet Detection</h3>
        <div className="space-y-2">
          <p>
            {/* @ts-ignore */}
            Leather Wallet: {typeof window !== 'undefined' && window.LeatherProvider ? '✅ Detected' : '❌ Not Found'}
          </p>
          <p>
            {/* @ts-ignore */}
            Stacks/Hiro Wallet: {typeof window !== 'undefined' && window.StacksProvider ? '✅ Detected' : '❌ Not Found'}
          </p>
        </div>
      </div>
    </div>
  );
} 