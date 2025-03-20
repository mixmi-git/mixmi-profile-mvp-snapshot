'use client';

import { useCallback, useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/lib/auth'

/**
 * NavbarContainer handles authentication logic and renders the Navbar
 * This pattern helps isolate auth logic from the main profile component
 */
export function NavbarContainer() {
  const { isAuthenticated, connectWallet, disconnectWallet, refreshAuthState, isInitialized } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  
  // Add debug logging for authentication state
  useEffect(() => {
    console.log('NavbarContainer auth state:', { isAuthenticated, isInitialized })
    
    // If auth is initialized or we have a definitive auth state, we can stop loading
    if (isInitialized || isAuthenticated !== undefined) {
      setIsLoading(false)
    }
  }, [isAuthenticated, isInitialized])
  
  // Add a timeout to clear loading state even if auth initialization takes too long
  useEffect(() => {
    // Force loading to stop after 3 seconds maximum, regardless of auth state
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('NavbarContainer: Forcing loading state to end after timeout')
        setIsLoading(false)
      }
    }, 3000)
    
    return () => clearTimeout(timeout)
  }, [isLoading])
  
  // Poll for auth state changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (isInitialized) {
        refreshAuthState()
      }
    }, 2000) // Check every 2 seconds
    
    return () => clearInterval(interval)
  }, [refreshAuthState, isInitialized])
  
  return (
    <Navbar
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      onConnect={connectWallet}
      onDisconnect={disconnectWallet}
    />
  )
} 