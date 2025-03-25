'use client';

import React from 'react';
import { IntegratedProfile } from '../components/IntegratedProfile';
import '../globals.css';

export default function IntegratedProfilePage() {
  return (
    <div className="bg-gray-900">
      <style jsx global>{`
        /* Layout styles to ensure horizontal arrangement */
        @media (min-width: 768px) {
          /* Force horizontal layout on desktop */
          .profile-container {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            gap: 3rem !important;
          }
          
          /* Text alignment on desktop */
          .profile-text-container {
            text-align: left !important;
            align-items: flex-start !important;
          }
        }
        
        /* Mobile layout (vertical stacking) */
        .profile-container {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }
        
        /* Text container always centered on mobile */
        .profile-text-container {
          text-align: center !important;
          align-items: center !important;
          margin-top: 1.5rem !important;
        }
        
        /* Profile image sizing */
        .profile-image-container {
          width: 420px !important;
          height: 420px !important;
          border: 2px solid #22d3ee !important;
          border-radius: 0.5rem !important;
          overflow: hidden !important;
          flex-shrink: 0 !important; /* Prevent image from shrinking */
        }
        
        /* Text styling */
        .profile-name {
          font-size: 2.5rem !important;
          font-weight: bold !important;
          color: #22d3ee !important;
          margin-bottom: 0.5rem !important;
        }
        
        .profile-title {
          font-size: 1.5rem !important;
          color: #e2e8f0 !important;
          margin-bottom: 1rem !important;
        }
        
        .profile-bio {
          color: #cbd5e1 !important;
          margin-bottom: 1.5rem !important;
        }
        
        /* Mobile responsive adjustments */
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