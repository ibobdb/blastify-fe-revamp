'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import {
  ConfirmDialogType,
  ConfirmDialogOptions,
} from '@/hooks/useConfirmDialog';

interface ConfirmDialogProps {
  open: boolean;
  options: ConfirmDialogOptions | null;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

/**
 * A reusable confirmation dialog component with different styles based on type:
 * - info: Blue, informational style
 * - warning: Yellow/amber, warning style
 * - danger: Red, destructive style
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  options,
  onOpenChange,
  isLoading = false,
}) => {
  if (!options) {
    return null;
  }

  const {
    title,
    description,
    type = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel',

    onConfirm,
    onCancel,
  } = options;

  // Determine icon and colors based on type
  const getIconAndColors = (type: ConfirmDialogType) => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertCircle className="h-6 w-6 text-destructive" />,
          confirmVariant: 'destructive' as const,
          iconContainer: 'bg-destructive/10 text-destructive',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
          confirmVariant: 'secondary' as const,
          iconContainer: 'bg-amber-500/10 text-amber-500',
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-6 w-6 text-primary" />,
          confirmVariant: 'default' as const,
          iconContainer: 'bg-primary/10 text-primary',
        };
    }
  };

  const { icon, confirmVariant, iconContainer } = getIconAndColors(type);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex gap-4 sm:flex-row sm:items-start sm:gap-4">
          <div className={`rounded-full p-2 ${iconContainer}`}>{icon}</div>
          <div className="flex-1">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription className="mt-2">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-3 sm:justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
