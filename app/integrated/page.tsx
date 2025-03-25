'use client';

import React from 'react';
import { IntegratedProfile } from '../components/IntegratedProfile';
import '../globals.css';

export default function IntegratedProfilePage() {
  return (
    <div className="bg-gray-900">
      <style jsx global>{`
        /* Fix for profile image display */
        .profile-image-container {
          width: 420px !important;
          height: 420px !important;
          border: 2px solid #22d3ee !important;
          border-radius: 0.5rem !important;
          overflow: hidden !important;
        }
        
        .profile-name {
          font-size: 2.5rem !important;
          font-weight: bold !important;
          color: #22d3ee !important;
        }
        
        .profile-title {
          font-size: 1.5rem !important;
          margin-top: 0.5rem !important;
          color: #e2e8f0 !important;
        }
        
        .profile-bio {
          margin-top: 1rem !important;
          margin-bottom: 2rem !important;
          color: #cbd5e1 !important;
        }
        
        @media (max-width: 768px) {
          .profile-image-container {
            width: 240px !important;
            height: 240px !important;
          }
          
          .profile-name {
            font-size: 2rem !important;
          }
          
          .profile-title {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
      <IntegratedProfile />
    </div>
  );
} 