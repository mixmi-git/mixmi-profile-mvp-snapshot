'use client';

import React from 'react';
import StacksConnect from './StacksConnect';
import { useAuthState } from '../hooks/useAuthState';

export const NavbarContainer: React.FC = () => {
  // For backward compatibility and logging, we'll keep the useAuthState hook
  // but use StacksConnect for the UI
  const { isAuthenticated, userAddress } = useAuthState();
  
  // Development-only logging
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('NavbarContainer - Auth state:', { isAuthenticated, userAddress });
    }
  }, [isAuthenticated, userAddress]);

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
          {/* Replace previous wallet connect UI with StacksConnect */}
          <StacksConnect />
        </div>
      </div>
    </header>
  );
}; 