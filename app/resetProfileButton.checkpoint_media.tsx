'use client';

import { Button } from '@/components/ui/button';

export function ResetProfileButton() {
  const handleReset = () => {
    if (typeof window === 'undefined') return;
    
    // Clear all profile data from localStorage
    localStorage.removeItem('mixmi_profile_data');
    localStorage.removeItem('mixmi_spotlight_items');
    localStorage.removeItem('mixmi_shop_items');
    localStorage.removeItem('mixmi_media_items');
    
    // Force reload to ensure everything is fresh
    window.location.reload();
  };
  
  return (
    <Button 
      onClick={handleReset} 
      variant="destructive"
      className="fixed bottom-4 left-4 z-50"
    >
      Reset Profile
    </Button>
  );
}

export default ResetProfileButton; 