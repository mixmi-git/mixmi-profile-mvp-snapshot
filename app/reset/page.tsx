'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResetPage() {
  const [cleared, setCleared] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear all localStorage data
      localStorage.clear();
      console.log('🧹 All localStorage data has been cleared');
      setCleared(true);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-cyan-300">App Reset Complete</h1>
        
        <div className="mb-6">
          <p className="mb-2">
            {cleared ? 
              "✅ All application data has been successfully cleared from your browser." :
              "⏳ Clearing application data..."}
          </p>
          <p className="text-gray-400 text-sm">
            This resolves issues caused by cached data or rendering loops.
          </p>
        </div>
        
        <div className="mt-8">
          <Link 
            href="/integrated" 
            className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded text-center transition-colors"
          >
            Go to Profile Page
          </Link>
        </div>
      </div>
    </div>
  );
} 