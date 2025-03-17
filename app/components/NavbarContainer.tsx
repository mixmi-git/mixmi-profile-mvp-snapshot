'use client';

import React, { useState } from 'react';
import { useAuthState } from '../hooks/useAuthState';

export const NavbarContainer: React.FC = () => {
  const { isAuthenticated, handleLoginToggle, userAddress, isTransitioning } = useAuthState();
  
  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="h-8 w-auto relative">
            <img
              src="/images/logos/Logotype_Main.svg"
              alt="mixmi"
              className="h-8 w-auto"
            />
          </a>
        </div>
        
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-md">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-mono text-gray-300">{formatAddress(userAddress)}</span>
              </div>
              <button
                onClick={handleLoginToggle}
                disabled={isTransitioning}
                className={`px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isTransitioning ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleLoginToggle}
              disabled={isTransitioning}
              className={`px-4 py-2 ${
                isTransitioning 
                  ? 'bg-gray-700 opacity-50 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-700'
              } rounded-md text-white transition-colors flex items-center`}
            >
              {isTransitioning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 20V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}; 