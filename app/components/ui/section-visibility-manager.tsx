'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from './switch';
import { Label } from './label';

interface SectionVisibility {
  spotlight?: boolean;
  media?: boolean;
  shop?: boolean;
  sticker?: boolean;
}

interface SectionVisibilityManagerProps {
  visibility: SectionVisibility;
  onVisibilityChange: (field: keyof SectionVisibility, value: boolean) => void;
  isAuthenticated?: boolean;
  className?: string;
}

/**
 * SectionVisibilityManager component for controlling which sections are visible
 */
const SectionVisibilityManager = ({
  visibility,
  onVisibilityChange,
  isAuthenticated = true,
  className = '',
}: SectionVisibilityManagerProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Do not render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Ensure visibility object exists even if undefined
  const safeVisibility = visibility || {};

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handler for toggling visibility
  const handleToggle = (section: keyof SectionVisibility) => {
    onVisibilityChange(section, !(safeVisibility[section] ?? true));
  };

  return (
    <Card className={cn('relative border border-gray-700/50', className)}>
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
          <h3 className="text-sm font-medium">Manage Sections</h3>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {isExpanded && (
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-spotlight" className="flex items-center cursor-pointer">
                Spotlight Section
              </Label>
              <Switch
                id="toggle-spotlight"
                checked={safeVisibility.spotlight ?? true}
                onCheckedChange={() => handleToggle('spotlight')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-media" className="flex items-center cursor-pointer">
                Media Section
              </Label>
              <Switch
                id="toggle-media"
                checked={safeVisibility.media ?? true}
                onCheckedChange={() => handleToggle('media')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-shop" className="flex items-center cursor-pointer">
                Shop Section
              </Label>
              <Switch
                id="toggle-shop"
                checked={safeVisibility.shop ?? true}
                onCheckedChange={() => handleToggle('shop')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-sticker" className="flex items-center cursor-pointer">
                Sticker
              </Label>
              <Switch
                id="toggle-sticker"
                checked={safeVisibility.sticker ?? true}
                onCheckedChange={() => handleToggle('sticker')}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export { SectionVisibilityManager }; 