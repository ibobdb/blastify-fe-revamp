import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export interface BroadcastSendConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
  onReset?: () => void;
}

export function BroadcastSendConfirm({
  isOpen,
  onClose,
  onConfirm,
  onReset,
}: BroadcastSendConfirmProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    if (onConfirm) {
      await onConfirm();
    }
    setLoading(false);
    setShowSuccess(true);
    onClose(); // close step 1 dialog
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  const handleReset = () => {
    setShowSuccess(false);
    if (onReset) onReset();
  };

  return (
    <>
      {/* Step 1: Confirmation Dialog */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Send Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-base text-gray-700 dark:text-gray-200">
              Are you sure you want to send this broadcast message?
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <DialogClose asChild>
                <Button variant="outline" disabled={loading} onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" disabled={loading} onClick={handleConfirm}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Step 2: Success Dialog */}
      <Dialog
        open={showSuccess}
        onOpenChange={(open) => {
          if (!open) setShowSuccess(false);
        }}
      >
        <DialogContent className="flex flex-1 flex-col items-center justify-center min-h-[320px] w-full">
          <DialogTitle asChild>
            <VisuallyHidden>Broadcast Sent Successfully</VisuallyHidden>
          </DialogTitle>
          <CheckCircle2 className="text-green-500 w-20 h-20 mb-4" />
          <div className="text-2xl mb-2 text-center">
            Broadcast sent successfully!
          </div>
          <div className="flex gap-4 mt-8">
            <Button type="button" size="lg" onClick={handleSuccessClose}>
              Keep State
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleReset}
            >
              Reset State
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
