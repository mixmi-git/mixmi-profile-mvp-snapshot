'use client';

import React, { useState } from 'react';
import { useStacks } from '../providers/StacksProvider';
import { Button } from './ui/button';
import { LogIn, LogOut, User, ChevronDown } from 'lucide-react';

const StacksConnect: React.FC = () => {
  const { isSignedIn, userData, handleSignIn, handleSignOut } = useStacks();
  const [isOpen, setIsOpen] = useState(false);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative">
      {isSignedIn ? (
        <div>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2"
          >
            <User size={16} className="text-cyan-400" />
            <span className="hidden md:inline">
              {formatAddress(userData?.profile?.stxAddress?.mainnet)}
            </span>
            <span className="md:hidden">
              {formatAddress(userData?.profile?.stxAddress?.mainnet)}
            </span>
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={handleSignIn}
          variant="default"
          className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
        >
          <LogIn size={16} />
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default StacksConnect; 