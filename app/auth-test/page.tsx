'use client';

import React, { useEffect, useState } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import { useAuth } from '../lib/auth';

export default function AuthTestPage() {
  const { isAuthenticated, userAddress, isTransitioning, handleLoginToggle } = useAuthState();
  const auth = useAuth(); // Direct access to the auth context for debugging
  
  // State to track debug mode
  const [debugEnabled, setDebugEnabled] = useState(false);
  
  // Function to toggle debug mode
  const toggleDebug = () => {
    if (typeof window !== 'undefined') {
      const newState = !(window as any).DEBUG_AUTH;
      (window as any).DEBUG_AUTH = newState;
      setDebugEnabled(newState);
      console.log(`Auth debugging ${newState ? 'enabled' : 'disabled'}`);
    }
  };
  
  // Enable debug mode on component mount if requested
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for debug query param
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'true') {
        (window as any).DEBUG_AUTH = true;
        setDebugEnabled(true);
        console.log('Auth debugging enabled by URL parameter');
      }
      
      // Sync local state with global debug state
      setDebugEnabled(!!(window as any).DEBUG_AUTH);
    }
  }, []);
  
  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return 'No address';
    return `${address.substring(0, 10)}...${address.substring(address.length - 10)}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Auth Test Page</h1>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded ${debugEnabled ? 'bg-green-600' : 'bg-gray-700'} flex items-center gap-2`}>
              <div className={`w-2 h-2 rounded-full ${debugEnabled ? 'bg-green-300' : 'bg-gray-400'}`}></div>
              <span className="text-sm">Debug: {debugEnabled ? 'ON' : 'OFF'}</span>
            </div>
            <button 
              onClick={toggleDebug}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded"
            >
              Toggle Debug
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Auth State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-md">
              <p className="text-sm text-gray-300 mb-1">Authentication Status:</p>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="font-medium">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-md">
              <p className="text-sm text-gray-300 mb-1">Wallet Address:</p>
              <p className="font-mono">{formatAddress(userAddress)}</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-md">
              <p className="text-sm text-gray-300 mb-1">Auth Initialized:</p>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${auth.isInitialized ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <p className="font-medium">{auth.isInitialized ? 'Initialized' : 'Initializing...'}</p>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-md">
              <p className="text-sm text-gray-300 mb-1">Transition State:</p>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isTransitioning ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                <p className="font-medium">{isTransitioning ? 'Transitioning...' : 'Stable'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleLoginToggle}
            disabled={isTransitioning}
            className={`px-6 py-3 rounded-md text-white ${
              isAuthenticated
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-cyan-600 hover:bg-cyan-700'
            } transition-colors ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isTransitioning ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isAuthenticated ? 'Disconnecting...' : 'Connecting...'}
              </span>
            ) : (
              <span>{isAuthenticated ? 'Disconnect Wallet' : 'Connect Wallet'}</span>
            )}
          </button>
        </div>
        
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tips</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>You can add <code className="bg-black px-1 py-0.5 rounded text-cyan-300">?debug=true</code> to the URL to automatically enable debugging</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>Open the browser console (F12) to see debug logs when debugging is enabled</span>
            </li>
          </ul>
        </div>

        <div className="flex mt-8">
          <a 
            href="/"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
} 