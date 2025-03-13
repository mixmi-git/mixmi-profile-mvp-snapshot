/** @jsxImportSource react */
'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export interface NavbarProps {
  isAuthenticated: boolean;
  onLoginToggle: () => void;
  isLoading?: boolean;
}

export function Navbar({ isAuthenticated, onLoginToggle, isLoading = false }: NavbarProps) {
  // Simple handler to log clicks
  const handleButtonClick = () => {
    console.log('Navbar: Button clicked');
    onLoginToggle();
  };
  
  return (
    <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm py-6 px-8 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center">
        <Link href="/">
          <div className="w-20 h-8 relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logotype_Main@1.5x-v0CzgGF3X0t7k4yaBbFQWerwN5bGdC.png"
              alt="mixmi"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          className="text-white border-white hover:bg-gray-800"
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : isAuthenticated ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
      </div>
    </nav>
  )
} 