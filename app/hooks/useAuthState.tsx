import { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth'
import { Profile } from '@/types/content'

/**
 * Custom hook to manage authentication state and login/logout functionality
 * 
 * @param onConnect - Optional callback function that runs when user connects wallet
 * @param onDisconnect - Optional callback function that runs when user disconnects wallet
 * @returns Authentication state and methods
 */
export function useAuthState(
  onConnect?: (savedData?: any) => void,
  onDisconnect?: () => void
) {
  const { isAuthenticated, connectWallet, disconnectWallet } = useAuth()
  const [isTransitioning, setIsTransitioning] = useState(false)

  /**
   * Toggle between connecting and disconnecting wallet
   */
  const handleLoginToggle = useCallback(async () => {
    setIsTransitioning(true)
    
    try {
      if (isAuthenticated) {
        await disconnectWallet()
        if (onDisconnect) {
          onDisconnect()
        }
      } else {
        await connectWallet()
        if (onConnect) {
          onConnect()
        }
      }
    } catch (error) {
      console.error('Error handling login toggle:', error)
    } finally {
      setIsTransitioning(false)
    }
  }, [isAuthenticated, connectWallet, disconnectWallet, onConnect, onDisconnect])

  return {
    isAuthenticated,
    isTransitioning,
    handleLoginToggle
  }
} 