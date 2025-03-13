'use client'

import { useState, useEffect } from 'react'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { Button } from '@/components/ui/button'

// Create a direct instantiation of the UserSession for testing
const appConfig = new AppConfig(['store_write'])
const directUserSession = new UserSession({ appConfig })

export default function SimpleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userAddress, setUserAddress] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  
  // Add a log entry with timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8)
    setLogs(prev => [`${timestamp} - ${message}`, ...prev].slice(0, 20))
  }
  
  // Check auth status directly
  const checkAuth = () => {
    try {
      if (directUserSession.isUserSignedIn()) {
        const userData = directUserSession.loadUserData()
        addLog('User is signed in')
        setIsAuthenticated(true)
        setUserAddress(userData.profile.stxAddress.mainnet)
      } else {
        addLog('User is NOT signed in')
        setIsAuthenticated(false)
        setUserAddress('')
      }
    } catch (error) {
      addLog(`Error checking auth: ${error}`)
    }
  }
  
  // Initialize
  useEffect(() => {
    addLog('Component mounted')
    checkAuth()
  }, [])
  
  // Connect directly
  const connectWallet = () => {
    addLog('Connecting wallet directly...')
    showConnect({
      appDetails: {
        name: 'Mixmi Test',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: window.location.origin + '/test-auth',
      onFinish: () => {
        try {
          const userData = directUserSession.loadUserData()
          addLog('Wallet connected!')
          setIsAuthenticated(true)
          setUserAddress(userData.profile.stxAddress.mainnet)
        } catch (error) {
          addLog(`Error in onFinish: ${error}`)
        }
      },
      userSession: directUserSession,
    })
  }
  
  // Disconnect directly
  const disconnectWallet = () => {
    addLog('Disconnecting wallet directly...')
    try {
      directUserSession.signUserOut(window.location.origin + '/test-auth')
      setIsAuthenticated(false)
      setUserAddress('')
      addLog('Wallet disconnected!')
    } catch (error) {
      addLog(`Error disconnecting: ${error}`)
    }
  }
  
  return (
    <div className="mt-12 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Direct Stacks Authentication Test</h2>
      
      <div className="mb-4">
        <p className="text-sm mb-2">
          <span className="text-gray-400">Status:</span> 
          {isAuthenticated ? ' Connected ✅' : ' Not Connected ❌'}
        </p>
        {userAddress && (
          <p className="text-sm mb-2">
            <span className="text-gray-400">Address:</span> {userAddress}
          </p>
        )}
      </div>
      
      <div className="flex space-x-4 mb-6">
        <Button
          variant="outline"
          onClick={connectWallet}
          disabled={isAuthenticated}
          className="border-cyan-300 text-cyan-300"
        >
          Direct Connect
        </Button>
        
        <Button
          variant="outline"
          onClick={disconnectWallet}
          disabled={!isAuthenticated}
          className="border-red-500 text-red-500"
        >
          Direct Disconnect
        </Button>
        
        <Button
          variant="outline"
          onClick={checkAuth}
          className="border-gray-400 text-gray-400"
        >
          Check Auth
        </Button>
      </div>
      
      <div className="h-40 overflow-y-auto text-xs">
        {logs.map((log, index) => (
          <div key={index} className="py-1 border-b border-gray-700">
            {log}
          </div>
        ))}
      </div>
    </div>
  )
} 