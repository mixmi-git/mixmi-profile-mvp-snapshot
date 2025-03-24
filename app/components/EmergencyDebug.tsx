'use client';

import React, { useState } from 'react';

export function EmergencyDebug() {
  const [walletResponse, setWalletResponse] = useState<string | null>(null);
  
  // Function to test direct wallet connection with Leather wallet compatibility
  const testLeatherWalletConnection = async () => {
    try {
      setWalletResponse('Attempting to connect to Leather wallet...');
      
      // Dynamically import the necessary libraries
      const { showConnect, AppConfig, UserSession } = await import('@stacks/connect');
      
      setWalletResponse('Libraries loaded, creating session...');
      
      // Create a new session
      const appConfig = new AppConfig(['store_write']);
      const userSession = new UserSession({ appConfig });
      
      setWalletResponse('Session created, showing connect dialog...');
      
      // Show connect dialog
      showConnect({
        appDetails: {
          name: 'Mixmi Debug - Leather Test',
          icon: '/favicon.ico',
        },
        redirectTo: window.location.origin,
        onFinish: () => {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            setWalletResponse(`Connected! Address: ${userData.profile.stxAddress.mainnet}`);
          } else {
            setWalletResponse('Connection completed but user is not signed in');
          }
        },
        userSession,
      });
      
      setWalletResponse('Connect dialog shown...');
    } catch (error: any) {
      setWalletResponse(`Error: ${error.message}`);
      console.error('Wallet connection error:', error);
    }
  };
  
  // Traditional Hiro wallet connection function
  const testHiroWalletConnection = async () => {
    try {
      setWalletResponse('Attempting to connect to Hiro wallet...');
      
      // Dynamically import the necessary libraries
      const { showConnect, AppConfig, UserSession } = await import('@stacks/connect');
      
      setWalletResponse('Libraries loaded, creating session...');
      
      // Create a new session
      const appConfig = new AppConfig(['store_write']);
      const userSession = new UserSession({ appConfig });
      
      setWalletResponse('Session created, showing connect dialog...');
      
      // Show connect dialog
      showConnect({
        appDetails: {
          name: 'Mixmi Debug - Hiro Test',
          icon: '/favicon.ico',
        },
        redirectTo: window.location.origin,
        onFinish: () => {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            setWalletResponse(`Connected! Address: ${userData.profile.stxAddress.mainnet}`);
          } else {
            setWalletResponse('Connection completed but user is not signed in');
          }
        },
        userSession,
      });
      
      setWalletResponse('Connect dialog shown...');
    } catch (error: any) {
      setWalletResponse(`Error: ${error.message}`);
      console.error('Wallet connection error:', error);
    }
  };
  
  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-4">Emergency Debug Page</h1>
      <p>If you can see this page, basic React rendering is working.</p>
      
      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h2 className="text-xl mb-2">Troubleshooting Info</h2>
        <p>Current environment: {process.env.NODE_ENV}</p>
        <p>Next.js version: {React.version}</p>
        
        <h3 className="text-lg mt-4 mb-2">Import Testing:</h3>
        <div className="bg-gray-900 p-2 rounded mb-4">
          {(() => {
            try {
              // Try to dynamically import the ProfileMode
              const { ProfileMode } = require('@/types');
              return (
                <div className="text-green-400">
                  ✅ Successfully imported ProfileMode from @/types
                  <pre className="text-xs mt-2">{JSON.stringify(ProfileMode, null, 2)}</pre>
                </div>
              );
            } catch (error: any) {
              return (
                <div className="text-red-400">
                  ❌ Error importing ProfileMode from @/types:
                  <pre className="text-xs mt-2">{error.message}</pre>
                </div>
              );
            }
          })()}
        </div>
        
        <h3 className="text-lg mt-4 mb-2">Local Storage Contents:</h3>
        <pre className="bg-gray-900 p-2 rounded overflow-auto max-h-40 text-xs">
          {typeof window !== 'undefined' 
            ? JSON.stringify(
                Object.keys(localStorage).reduce((acc, key) => {
                  try {
                    acc[key] = localStorage.getItem(key)?.substring(0, 50) + '...';
                  } catch (e) {
                    acc[key] = 'Error reading';
                  }
                  return acc;
                }, {} as Record<string, string>), 
                null, 2
              )
            : 'Not in browser environment'
          }
        </pre>
        
        <h3 className="text-lg mt-4 mb-2">Wallet Detection:</h3>
        <div className="bg-gray-900 p-2 rounded mb-4">
          {typeof window !== 'undefined' ? (
            <div>
              <p className="mb-2">
                {/* @ts-ignore */}
                Hiro/Stacks Provider: {window.StacksProvider ? '✅ Found' : '❌ Not Found'}
              </p>
              <p className="mb-2">
                {/* @ts-ignore */}
                Leather Wallet Provider: {window.LeatherProvider ? '✅ Found' : '❌ Not Found'}
              </p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
                onClick={() => {
                  // Check browser extensions and providers
                  const providers = [];
                  // @ts-ignore
                  if (window.StacksProvider) providers.push('Stacks Provider');
                  // @ts-ignore
                  if (window.LeatherProvider) providers.push('Leather Provider');
                  
                  // Check any additional wallet-related objects
                  const walletInfo = {
                    providers,
                    // @ts-ignore
                    stacksProvider: typeof window.StacksProvider,
                    // @ts-ignore
                    leatherProvider: typeof window.LeatherProvider,
                    // List other potentially useful global objects
                    navigatorVendor: navigator.vendor,
                    userAgent: navigator.userAgent,
                  };
                  
                  alert(JSON.stringify(walletInfo, null, 2));
                }}
              >
                Analyze Wallet Providers
              </button>
            </div>
          ) : (
            <p>Cannot check wallet - not in browser environment</p>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          onClick={() => {
            if (typeof window !== 'undefined') {
              Object.keys(localStorage)
                .filter(key => key.includes('mixmi_'))
                .forEach(key => {
                  try {
                    localStorage.removeItem(key);
                  } catch (e) {
                    console.error(`Failed to remove ${key}:`, e);
                  }
                });
              alert('All Mixmi data cleared from localStorage!');
              window.location.reload();
            }
          }}
        >
          Clear All Mixmi Data
        </button>
      </div>
      
      <div className="mt-4 p-4 bg-gray-800 rounded">
        <h2 className="text-xl mb-4">Direct Wallet Connection Test</h2>
        <div className="flex space-x-2">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={testLeatherWalletConnection}
          >
            Test Leather Wallet
          </button>
          
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={testHiroWalletConnection}
          >
            Test Hiro Wallet
          </button>
        </div>
        
        {walletResponse && (
          <div className="mt-4 p-3 bg-gray-900 rounded text-sm">
            <p className="font-mono">{walletResponse}</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <div className="flex justify-center space-x-4">
          <a href="/" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white">
            Home
          </a>
          <a href="/simple" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white">
            Simple Profile
          </a>
          <a href="/wallet" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white">
            Wallet Test
          </a>
        </div>
      </div>
    </div>
  );
}

export default EmergencyDebug; 