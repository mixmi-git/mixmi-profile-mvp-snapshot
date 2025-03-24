'use client';

import React, { ReactNode } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface HoverControlProps {
  children: ReactNode;
  controls: ReactNode;
  isAuthenticated?: boolean;
  showOnMobile?: boolean;
  className?: string;
  controlsClassName?: string;
  controlsPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right';
  alwaysShow?: boolean;
}

/**
 * HoverControls component that displays controls when hovering over a section
 * Handles both desktop hover and mobile tap scenarios
 */
const HoverControls = ({
  children,
  controls,
  isAuthenticated = true,
  showOnMobile = true,
  className = '',
  controlsClassName = '',
  controlsPosition = 'top-right',
  alwaysShow = false,
}: HoverControlProps) => {
  // If not authenticated, just render children
  if (!isAuthenticated) {
    return <div className={className}>{children}</div>;
  }

  // Position classes based on controlsPosition
  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'center-right': 'top-1/2 right-2 transform -translate-y-1/2',
  };

  return (
    <div 
      className={cn(
        'group relative', 
        className,
        {'hover:bg-gray-100/5 dark:hover:bg-gray-800/10 rounded transition-colors duration-200': isAuthenticated}
      )}
    >
      {children}
      
      <div 
        className={cn(
          'absolute z-10 transition-all duration-200',
          positionClasses[controlsPosition],
          alwaysShow 
            ? 'opacity-100' 
            : 'opacity-0 group-hover:opacity-100',
          showOnMobile 
            ? 'sm:opacity-0 sm:group-hover:opacity-100' 
            : 'hidden sm:block sm:opacity-0 sm:group-hover:opacity-100',
          controlsClassName
        )}
      >
        {controls}
      </div>
    </div>
  );
};

// Additional export for a simple edit button with hover control
interface EditButtonControlProps {
  onEdit: () => void;
  isAuthenticated?: boolean;
  label?: string;
  className?: string;
  controlsPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right';
  icon?: ReactNode;
  children: ReactNode;
  showOnMobile?: boolean;
}

const EditButtonControl = ({
  onEdit,
  isAuthenticated = true,
  label = 'Edit',
  className = '',
  controlsPosition = 'top-right',
  icon,
  children,
  showOnMobile = true,
}: EditButtonControlProps) => {
  return (
    <HoverControls
      isAuthenticated={isAuthenticated}
      className={className}
      controlsPosition={controlsPosition}
      showOnMobile={showOnMobile}
      controls={
        <Button 
          onClick={onEdit} 
          size="sm" 
          variant="secondary" 
          className="bg-gray-800/70 hover:bg-gray-700 text-white"
        >
          {icon}
          {label}
        </Button>
      }
    >
      {children}
    </HoverControls>
  );
};

export { HoverControls, EditButtonControl }; 