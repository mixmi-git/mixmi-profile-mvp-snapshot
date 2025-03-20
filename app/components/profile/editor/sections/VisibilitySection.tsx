'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";

interface VisibilityProps {
  sectionVisibility: {
    spotlight?: boolean;
    media?: boolean;
    shop?: boolean;
  };
  updateVisibility: (visibility: { spotlight?: boolean; media?: boolean; shop?: boolean; }) => void;
}

export default function VisibilitySection({ 
  sectionVisibility = { spotlight: true, media: true, shop: true },
  updateVisibility
}: VisibilityProps) {
  // Track if this is the first render
  const isFirstRender = useRef(true);
  
  // Safe initial values with defaults
  const initialVisibility = {
    spotlight: sectionVisibility?.spotlight !== false,
    media: sectionVisibility?.media !== false,
    shop: sectionVisibility?.shop !== false
  };
  
  // Use local state to avoid direct prop usage in checkboxes
  const [localVisibility, setLocalVisibility] = useState(initialVisibility);
  
  // Update local state when props change, but only after first render
  useEffect(() => {
    // Skip the first render to avoid an initial double-update
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    setLocalVisibility({
      spotlight: sectionVisibility?.spotlight !== false,
      media: sectionVisibility?.media !== false,
      shop: sectionVisibility?.shop !== false
    });
  }, [sectionVisibility]);

  // Memoize the handler to prevent recreation on each render
  const handleVisibilityChange = useCallback((section: 'spotlight' | 'media' | 'shop', checked: boolean) => {
    // Update local state first
    setLocalVisibility(prev => {
      const newState = {
        ...prev,
        [section]: checked
      };
      
      // Use setTimeout to break the potential update cycle
      setTimeout(() => {
        updateVisibility(newState);
      }, 0);
      
      return newState;
    });
  }, [updateVisibility]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-cyan-500" />
            <h3 className="text-xl font-semibold">Section Visibility</h3>
          </div>
          
          <div className="bg-blue-500/10 text-blue-300 text-xs p-2 rounded mb-2">
            <p>Control which sections are visible on your profile page</p>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="spotlight-visible" 
                checked={localVisibility.spotlight}
                onCheckedChange={(checked) => handleVisibilityChange('spotlight', !!checked)}
              />
              <Label htmlFor="spotlight-visible">Show Spotlight Section</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="media-visible" 
                checked={localVisibility.media}
                onCheckedChange={(checked) => handleVisibilityChange('media', !!checked)}
              />
              <Label htmlFor="media-visible">Show Media Section</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="shop-visible" 
                checked={localVisibility.shop}
                onCheckedChange={(checked) => handleVisibilityChange('shop', !!checked)}
              />
              <Label htmlFor="shop-visible">Show Shop Section</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 