import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SpotlightEditor } from '../sections/SpotlightEditor';
import { SpotlightItem } from '@/types';

interface SpotlightEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SpotlightItem[];
  onSave: (items: SpotlightItem[]) => void;
}

export const SpotlightEditorModal: React.FC<SpotlightEditorModalProps> = ({
  isOpen,
  onClose,
  items,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800 p-2 sm:pt-4 sm:px-4 sm:pb-4">
        <div className="max-h-[80vh] overflow-y-auto">
          <SpotlightEditor
            items={items}
            onSave={(updatedItems) => {
              onSave(updatedItems);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}; 