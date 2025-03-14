'use client';

import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';

export const NavbarContainer: React.FC = () => {
  const { isAuthenticated, handleLoginToggle } = useAuthState();

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
          <button
            onClick={handleLoginToggle}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
          >
            {isAuthenticated ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}; 