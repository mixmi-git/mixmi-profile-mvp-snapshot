'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TestAuth() {
  const { 
    isAuthenticated, 
    userAddress, 
    connectWallet, 
    disconnectWallet, 
    refreshAuthState, 
    isInitialized 
  } = useAuth()
  
  const [logs, setLogs] = useState<string[]>([])
  
  // Add a log entry with timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8)
    setLogs(prev => [`${timestamp} - ${message}`, ...prev].slice(0, 20))
  }
  
  // Log state changes
  useEffect(() => {
    addLog(`Auth state updated - authenticated: ${isAuthenticated}, initialized: ${isInitialized}`)
  }, [isAuthenticated, isInitialized])
  
  // Handle connect
  const handleConnect = async () => {
    addLog('Attempting to connect wallet...')
    try {
      await connectWallet()
      addLog('Connect wallet function called')
    } catch (error) {
      addLog(`Error connecting: ${error}`)
    }
  }
  
  // Handle disconnect
  const handleDisconnect = async () => {
    addLog('Attempting to disconnect wallet...')
    try {
      await disconnectWallet()
      addLog('Disconnect wallet function called')
    } catch (error) {
      addLog(`Error disconnecting: ${error}`)
    }
  }
  
  // Handle refresh
  const handleRefresh = () => {
    addLog('Manually refreshing auth state...')
    refreshAuthState()
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-cyan-300 mb-2">Auth Test Page</h1>
          <Link href="/" className="text-cyan-300 hover:underline">
            Return to main page
          </Link>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg mb-6">
          <h2 className="text-xl mb-4">Authentication State</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">Authenticated:</span> {isAuthenticated ? 'Yes ✅' : 'No ❌'}</p>
            <p><span className="text-gray-400">Initialized:</span> {isInitialized ? 'Yes ✅' : 'No ❌'}</p>
            <p><span className="text-gray-400">User Address:</span> {userAddress || 'None'}</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-8">
          <Button 
            variant="outline" 
            onClick={handleConnect}
            disabled={isAuthenticated}
            className="border-cyan-300 text-cyan-300"
          >
            Connect Wallet
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDisconnect}
            disabled={!isAuthenticated}
            className="border-red-500 text-red-500"
          >
            Disconnect Wallet
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleRefresh}
            className="border-gray-400 text-gray-400"
          >
            Refresh Auth State
          </Button>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl mb-4">Auth Logs</h2>
          <div className="h-80 overflow-y-auto text-xs">
            {logs.map((log, index) => (
              <div key={index} className="py-1 border-b border-gray-700">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 