import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface NavbarProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function Navbar({ isAuthenticated, isLoading, onConnect, onDisconnect }: NavbarProps) {
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
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : isAuthenticated ? (
            <Button onClick={onDisconnect} variant="outline">
              Disconnect Wallet
            </Button>
          ) : (
            <Button onClick={onConnect}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 