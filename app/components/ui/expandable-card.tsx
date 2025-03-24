'use client';

import React, { useState, ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './card';
import { Button } from './button';
import { Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableCardProps {
  /** Card title content */
  title?: ReactNode;
  /** Card description or main content */
  children: ReactNode;
  /** Content to show when card is expanded for editing */
  expandedContent?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  /** Whether the user is authenticated and can edit */
  isAuthenticated?: boolean;
  /** Whether the card is currently in edit mode */
  isEditing?: boolean;
  /** Callback when edit mode is toggled */
  onEditToggle?: (isEditing: boolean) => void;
  /** Callback when changes are saved */
  onSave?: () => void;
  /** Callback when editing is cancelled */
  onCancel?: () => void;
  /** Additional className for the card */
  className?: string;
  /** The unique identifier for the card */
  id?: string;
}

/**
 * ExpandableCard component that expands to show an edit form when in edit mode
 */
const ExpandableCard = ({
  title,
  children,
  expandedContent,
  footer,
  isAuthenticated = true,
  isEditing: externalIsEditing,
  onEditToggle,
  onSave,
  onCancel,
  className = '',
  id,
}: ExpandableCardProps) => {
  // Use internal state if external control is not provided
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  // Expanded state for mobile view
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Toggle edit mode
  const handleEditToggle = () => {
    const newState = !isEditing;
    setInternalIsEditing(newState);
    
    if (onEditToggle) {
      onEditToggle(newState);
    }
    
    // Auto-expand when editing
    if (newState) {
      setIsExpanded(true);
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    
    setInternalIsEditing(false);
    if (onEditToggle) {
      onEditToggle(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    
    setInternalIsEditing(false);
    if (onEditToggle) {
      onEditToggle(false);
    }
  };
  
  // Toggle expanded state (primarily for mobile)
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        {
          'shadow-md': isEditing,
          'bg-gray-800/20': isEditing,
        },
        className
      )}
      id={id}
    >
      {/* Edit button - shown on hover when authenticated */}
      {isAuthenticated && !isEditing && (
        <button
          onClick={handleEditToggle}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/70 hover:bg-gray-700 text-white p-1.5 rounded-full z-10"
          aria-label="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}
      
      {/* Mobile expand/collapse button */}
      <button
        onClick={toggleExpanded}
        className="absolute top-2 left-2 sm:hidden bg-gray-800/70 hover:bg-gray-700 text-white p-1.5 rounded-full z-10"
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Card Header */}
      {title && (
        <CardHeader className={cn({
          'pb-0': !isEditing && !isExpanded,
          'pb-4': isEditing || isExpanded
        })}>
          {title}
        </CardHeader>
      )}

      {/* Main Content - Either normal content or expanded edit form */}
      <CardContent className={cn({
        'hidden sm:block': !isExpanded && !isEditing,
        'block': isExpanded || isEditing
      })}>
        {isEditing && expandedContent ? expandedContent : children}
      </CardContent>

      {/* Card Footer - Contains save/cancel buttons when editing */}
      {(footer || isEditing) && (
        <CardFooter className={cn({
          'hidden sm:flex': !isExpanded && !isEditing && footer,
          'flex': isExpanded || isEditing || !footer
        })}>
          {isEditing ? (
            <div className="flex gap-2 w-full justify-end">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          ) : footer}
        </CardFooter>
      )}
    </Card>
  );
};

export { ExpandableCard }; 