import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PersonalInfoEditor } from '../sections/PersonalInfoEditor';
import { PersonalInfoEditorModalProps } from '@/types/profile';

export const PersonalInfoEditorModal: React.FC<PersonalInfoEditorModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-white">
            Edit Profile Details
          </DialogTitle>
        </DialogHeader>
        <PersonalInfoEditor
          profile={profile}
          onSave={onSave}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}; 