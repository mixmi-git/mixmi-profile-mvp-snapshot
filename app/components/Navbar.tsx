import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Edit2 } from 'lucide-react';

interface NavbarProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  onLoginToggle: () => void;
  onEditProfile?: () => void;
  
  // Edit mode props
  inEditMode?: boolean;
  onSaveProfile?: () => void;
  onCancelEdit?: () => void;
}

export function Navbar({ 
  isAuthenticated, 
  isLoading, 
  onLoginToggle, 
  onEditProfile,
  inEditMode = false,
  onSaveProfile,
  onCancelEdit
}: NavbarProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="h-8 w-auto relative">
            <img
              src="/images/logos/Logotype_Main.svg"
              alt="mixmi"
              className="h-8 w-auto"
            />
          </a>
          
          {/* Mode indicator tag */}
          {inEditMode && (
            <div className="ml-4 px-2 py-1 bg-amber-600/70 text-white text-xs rounded">
              EDIT MODE
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          {/* Profile Edit/Save Button */}
          {isAuthenticated && (
            inEditMode ? (
              <>
                {/* Edit mode buttons */}
                {onCancelEdit && (
                  <Button 
                    onClick={onCancelEdit}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                )}
                
                {onSaveProfile && (
                  <Button 
                    onClick={onSaveProfile}
                    variant="default"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Save Changes
                  </Button>
                )}
              </>
            ) : (
              /* View mode - Edit Profile button */
              onEditProfile && (
                <Button 
                  onClick={onEditProfile}
                  variant="outline"
                  className="border-cyan-800 text-cyan-300 hover:bg-gray-800"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )
            )
          )}
          
          {/* Auth button - always visible */}
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : (
            <Button 
              onClick={onLoginToggle} 
              variant={isAuthenticated ? "outline" : "default"}
            >
              {isAuthenticated ? "Disconnect Wallet" : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 