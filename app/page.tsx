'use client';

import React, { Suspense } from 'react';
import { UserProfileContainer } from '@/components/profile/UserProfileContainer';

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading profile...</p>
      </div>
    }>
      <UserProfileContainer />
    </Suspense>
  );
}