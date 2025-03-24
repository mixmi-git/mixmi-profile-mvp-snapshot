'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { MinimalProfile } from '@/components/MinimalProfile';

export default function HomePage() {
  const [hasError, setHasError] = useState(false);
  
  return (
    <>
      {!hasError ? (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <p>Loading profile...</p>
          </div>
        }>
          <ErrorBoundary onError={() => setHasError(true)}>
            {/* Use the MinimalProfile component which has no dependencies on problematic components */}
            <MinimalProfile />
          </ErrorBoundary>
        </Suspense>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
          <h1 className="text-3xl mb-6">Mixmi Recovery Mode</h1>
          
          <div className="flex space-x-4 mb-8">
            <Link 
              href="/minimal" 
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Go to Minimal Profile
            </Link>
            <Link 
              href="/simple" 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Go to Simple Profile
            </Link>
            <Link 
              href="/debug" 
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
            >
              Go to Debug Page
            </Link>
          </div>
          
          <div className="max-w-xl bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl mb-4">Troubleshooting Information</h2>
            <p className="mb-2">There was an issue with the application that prevented it from loading properly.</p>
            <p className="mb-4">Use one of the alternative pages above to continue.</p>
            
            <h3 className="text-lg mt-6 mb-2">Error Details:</h3>
            <p className="text-red-400">An unexpected error occurred in the application.</p>
          </div>
        </div>
      )}
    </>
  );
}

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError: () => void;
}> {
  componentDidCatch(error: any) {
    console.error("Error caught by boundary:", error);
    this.props.onError();
  }
  
  render() {
    return this.props.children;
  }
}