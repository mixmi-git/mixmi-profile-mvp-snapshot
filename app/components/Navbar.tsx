import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw } from 'lucide-react';

interface NavbarProps {
  isAuthenticated: boolean;
  isLoading?: boolean;
  onLoginToggle: () => void;
}

export function Navbar({ isAuthenticated, isLoading = false, onLoginToggle }: NavbarProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
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
        
        <div className="flex gap-3">
          {/* Auth button - always visible */}
          <Button
            onClick={onLoginToggle}
            className="relative z-20 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>{isAuthenticated ? 'Disconnecting...' : 'Connecting...'}</span>
              </span>
            ) : (
              <span>{isAuthenticated ? 'Disconnect' : 'Connect Wallet'}</span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
} 