'use client'

import { useAuth } from '@/lib/auth'
import { useEffect, useState } from 'react'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { Button } from '@/components/ui/button'

// Import from auth.ts
const appConfig = new AppConfig(['store_write']);
const globalUserSession = new UserSession({ appConfig });

export function AuthDebug() {
  const { isAuthenticated, userAddress, isInitialized, refreshAuthState } = useAuth()
  const [logs, setLogs] = useState<string[]>([])
  const [sessionFound, setSessionFound] = useState(false)
  
  // Add a log entry with timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8)
    setLogs(prev => [`${timestamp} - ${message}`, ...prev].slice(0, 10))
  }
  
  // Direct connect function that bypasses hooks for testing
  const handleDirectConnect = () => {
    addLog('Direct connect with GLOBAL session');
    
    try {
      // Use the same session that the main app uses
      showConnect({
        appDetails: {
          name: 'Mixmi Direct',
          icon: window.location.origin + '/favicon.ico',
        },
        redirectTo: window.location.origin,
        onFinish: () => {
          addLog('Direct connect: onFinish triggered');
          setTimeout(() => {
            refreshAuthState();
            checkLocalStorage();
          }, 500);
        },
        userSession: globalUserSession,
      });
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };
  
  // Log state changes
  useEffect(() => {
    addLog(`Auth state: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`)
    
    // Poll for auth state changes
    const interval = setInterval(() => {
      refreshAuthState()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [isAuthenticated, refreshAuthState])
  
  const checkLocalStorage = () => {
    try {
      // Check for common Stacks storage keys
      const storageKeys = Object.keys(localStorage);
      const stacksKeys = storageKeys.filter(key => 
        key.includes('blockstack') || 
        key.includes('stacks')
      );
      
      addLog(`Found ${stacksKeys.length} Stacks keys in storage`);
      setSessionFound(stacksKeys.length > 0);
      
      // Look for a session specifically
      const sessionData = localStorage.getItem('blockstack-session');
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          addLog('Session exists in localStorage!');
          
          // Force the app to recognize this session
          setTimeout(() => {
            refreshAuthState();
          }, 500);
        } catch (e) {
          addLog('Error parsing session data');
        }
      } else {
        addLog('No blockstack-session found');
      }
    } catch (e) {
      addLog('Error checking localStorage');
    }
  };
  
  if (process.env.NODE_ENV === 'production') {
    return null
  }
  
  return (
    <div className="fixed top-20 right-0 bg-gray-800 text-white text-xs p-2 z-50 w-64 rounded-l-md shadow-lg border-l border-t border-b border-gray-700">
      <div className="font-bold mb-1">Auth Debug</div>
      <div className="space-y-1">
        <div>Auth: {isAuthenticated ? 'Connected ✅' : 'Not Auth ❌'}</div>
        <div>Init: {isInitialized ? 'Yes ✅' : 'No ❌'}</div>
        <div>Storage: {sessionFound ? 'Session Found ✅' : 'No Session ❌'}</div>
        {userAddress && <div>Address: {userAddress.slice(0, 8)}...</div>}
      </div>
      <div className="mt-2 space-y-1">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDirectConnect}
          className="text-xs h-6 w-full"
        >
          Direct Connect Test
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={checkLocalStorage}
          className="text-xs h-6 w-full"
        >
          Check Storage
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            addLog('Force refreshing auth state');
            refreshAuthState();
          }}
          className="text-xs h-6 w-full"
        >
          Force Refresh Auth
        </Button>
      </div>
      <div className="mt-2 pt-1 border-t border-gray-700">
        <div className="font-bold mb-1">Logs:</div>
        {logs.map((log, i) => (
          <div key={i} className="text-gray-400 truncate">{log}</div>
        ))}
      </div>
    </div>
  )
} 