/** @jsxImportSource react */
'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCallback } from "react"

export interface NavbarProps {
  isAuthenticated: boolean;
  onLoginToggle: () => void;
  isLoading?: boolean;
}

export function Navbar({ isAuthenticated, onLoginToggle, isLoading = false }: NavbarProps) {
  // Add a direct handler to ensure clicks are registered
  const handleButtonClick = useCallback(() => {
    console.log('Navbar: Button clicked directly');
    
    // Add a small delay to ensure event propagation isn't an issue
    setTimeout(() => {
      try {
        console.log('Navbar: Calling onLoginToggle from direct handler');
        onLoginToggle();
      } catch (error) {
        console.error('Navbar: Error in direct click handler', error);
      }
    }, 50);
  }, [onLoginToggle]);
  
  return (
    <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm py-6 px-8 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center">
        <Link href="/">
          <div className="h-8 w-auto relative">
            <Image
              src="/images/logos/Logotype_Main.svg"
              alt="mixmi"
              width={120}
              height={32}
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          className="text-white border-white hover:bg-gray-800"
          onClick={handleButtonClick} // Use our direct handler
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : isAuthenticated ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
      </div>
    </nav>
  )
} 