'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { DateTimePicker } from '../ui/datetime-picker';
import { Badge } from '../ui/badge';

export interface BroadcastSendConfirmProps {
  isOpen: boolean;
  isScheduled?: boolean;
  onClose: () => void;
  onConfirm?: (schedule: ScheduleResponse) => Promise<void> | void;
  onReset?: () => void;
}
export type ScheduleResponse = {
  status: boolean;
  date: Date;
};
export function BroadcastSendConfirm({
  isOpen,
  onClose,
  onConfirm,
  onReset,
  isScheduled,
}: BroadcastSendConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDateValid, setIsDateValid] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (isScheduled) {
        setCurrentStep(3);
      } else {
        setCurrentStep(1);
      }
    }
  }, [isOpen, isScheduled]);

  const handleConfirm = async () => {
    setLoading(true);
    if (onConfirm) {
      await onConfirm({
        status: isScheduled ? true : false,
        date: isScheduled ? new Date(selectedDate ?? Date.now()) : new Date(),
      });
    }
    setLoading(false);
    setCurrentStep(2);
    onClose(); // close step 1 dialog
  };

  const handleSuccessClose = () => {
    setCurrentStep(1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    isScheduled = false;
    setSelectedDate(null);
    setIsDateValid(false);
    if (onReset) onReset();
  };
  const handleScheduleConfirm = async () => {
    setLoading(true);
    // Add a delay before changing to step 1
    setTimeout(() => {
      setCurrentStep(1);
      setLoading(false);
    }, 500);
  };
  return (
    <>
      {/* Step 1: Confirmation Dialog */}
      {currentStep === 1 && (
        <Dialog
          open={isOpen && currentStep === 1}
          onOpenChange={(open) => {
            setSelectedDate(null);
            setIsDateValid(false);
            if (!open) onClose();
          }}
        >
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>
                {isDateValid && selectedDate !== null
                  ? 'Send Broadcast Message'
                  : 'Confirm Send Message'}
              </DialogTitle>
            </DialogHeader>
            <div className="">
              <div className="text-base text-gray-700 dark:text-gray-200">
                {isDateValid && selectedDate !== null
                  ? `Are you sure you want to send this broadcast message at   ${selectedDate.toLocaleDateString()}
                      ${selectedDate.toLocaleTimeString()}?`
                  : 'Are you sure you want to send this broadcast message?'}
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    disabled={loading}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirm}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Step 2: Success Dialog */}
      {currentStep === 2 && (
        <Dialog
          open={isOpen && currentStep === 2}
          onOpenChange={(open) => {
            if (!open) setCurrentStep(1);
          }}
        >
          <DialogContent className="">
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
      )}
      {currentStep === 3 && (
        <Dialog
          open={isOpen && currentStep === 3}
          onOpenChange={(open) => {
            if (!open) {
              // Reset scheduling state
              setSelectedDate(null);
              setIsDateValid(false);
              onClose();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Setup</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-base text-gray-700 dark:text-gray-200 flex items-center gap-2">
                Please select the date and time to schedule this broadcast
                message.
              </div>
              <DateTimePicker
                minToday={true}
                onChange={(value) => {
                  if (value.isValid == false) {
                    setIsDateValid(false);
                    setSelectedDate(null);
                  } else {
                    setIsDateValid(true);
                    setSelectedDate(value.date);
                  }
                }}
              />
            </div>
            <DialogFooter>
              <div className="flex gap-2 justify-end mt-6">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    disabled={loading}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  disabled={loading || !isDateValid}
                  onClick={handleScheduleConfirm}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Scheduling...' : 'Save'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
