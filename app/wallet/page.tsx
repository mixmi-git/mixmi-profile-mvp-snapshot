'use client';

import React from 'react';
import { SimpleWalletConnector } from '../components/SimpleWalletConnector';

export default function WalletTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-5">
      <h1 className="text-3xl text-white text-center mb-8">Wallet Connection Test</h1>
      <SimpleWalletConnector />
      
      <div className="text-center mt-8">
        <a href="/" className="text-blue-400 hover:text-blue-300">Back to Home</a>
        {' | '}
        <a href="/simple" className="text-blue-400 hover:text-blue-300">Simple Profile</a>
        {' | '}
        <a href="/debug" className="text-blue-400 hover:text-blue-300">Debug Page</a>
      </div>
    </div>
  );
} 