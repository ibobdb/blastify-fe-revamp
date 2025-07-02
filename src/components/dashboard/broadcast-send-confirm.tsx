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
import {
  CheckCircle2,
  Loader2,
  Clock,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { DateTimePicker } from '../ui/datetime-picker';
import { Badge } from '../ui/badge';

export interface BroadcastSendConfirmProps {
  isOpen: boolean;
  isScheduled?: boolean;
  onClose: () => void;
  onConfirm?: (
    schedule: ScheduleResponse
  ) => Promise<ConfirmResult> | ConfirmResult;
  onReset?: () => void;
}

export type ScheduleResponse = {
  status: boolean;
  date: Date;
};

export type ConfirmResult = {
  success: boolean;
  message?: string;
  error?: string;
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
  const [result, setResult] = useState<ConfirmResult | null>(null);

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
    try {
      if (onConfirm) {
        const response = await onConfirm({
          status: selectedDate !== null,
          date: selectedDate !== null ? selectedDate : new Date(),
        });

        // Handle the response
        if (response && typeof response === 'object' && 'success' in response) {
          setResult(response);
          setCurrentStep(response.success ? 2 : 4); // Step 2 for success, Step 4 for failure
        } else {
          // If no response object, assume success (backward compatibility)
          setResult({
            success: true,
            message:
              selectedDate !== null
                ? 'Broadcast scheduled and added to queue successfully!'
                : 'Broadcast added to queue successfully!',
          });
          setCurrentStep(2);
        }
      } else {
        // If no onConfirm handler, assume success
        setResult({
          success: true,
          message:
            selectedDate !== null
              ? 'Broadcast scheduled and added to queue successfully!'
              : 'Broadcast added to queue successfully!',
        });
        setCurrentStep(2);
      }
    } catch (error) {
      // Handle unexpected errors
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setCurrentStep(1);
    setResult(null);
    onClose();
  };

  const handleReset = () => {
    setCurrentStep(1);
    isScheduled = false;
    setSelectedDate(null);
    setIsDateValid(false);
    setResult(null);
    if (onReset) onReset();
    onClose();
  };

  const handleRetry = () => {
    setCurrentStep(1);
    setResult(null);
  };
  const handleScheduleConfirm = async () => {
    setLoading(true);
    try {
      if (onConfirm) {
        const response = await onConfirm({
          status: true,
          date: new Date(selectedDate ?? Date.now()),
        });

        // Handle the response
        if (response && typeof response === 'object' && 'success' in response) {
          setResult(response);
          setCurrentStep(response.success ? 2 : 4); // Step 2 for success, Step 4 for failure
        } else {
          // If no response object, assume success (backward compatibility)
          setResult({
            success: true,
            message: 'Broadcast scheduled and added to queue successfully!',
          });
          setCurrentStep(2);
        }
      } else {
        // If no onConfirm handler, assume success
        setResult({
          success: true,
          message: 'Broadcast scheduled and added to queue successfully!',
        });
        setCurrentStep(2);
      }
    } catch (error) {
      // Handle unexpected errors
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to schedule broadcast',
      });
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
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
                {selectedDate !== null
                  ? 'Confirm Scheduled Broadcast'
                  : 'Confirm Send Message'}
              </DialogTitle>
            </DialogHeader>
            <div className="">
              <div className="text-base text-gray-700 dark:text-gray-200">
                {selectedDate !== null
                  ? `Are you sure you want to schedule this broadcast message for ${selectedDate.toLocaleDateString()} at ${selectedDate.toLocaleTimeString()}?`
                  : 'Are you sure you want to send this broadcast message?'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    {selectedDate !== null
                      ? 'Your message will be scheduled and added to the sending queue. It will be automatically delivered to all recipients at the specified time.'
                      : 'Your message will be added to the sending queue and delivered to recipients shortly.'}
                  </span>
                </div>
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
                  {loading
                    ? selectedDate !== null
                      ? 'Scheduling...'
                      : 'Sending...'
                    : selectedDate !== null
                    ? 'Schedule Broadcast'
                    : 'Send Now'}
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
            if (!open) {
              setCurrentStep(1);
              setResult(null);
            }
          }}
        >
          <DialogContent className="">
            <DialogTitle asChild>
              <VisuallyHidden>Broadcast Sent Successfully</VisuallyHidden>
            </DialogTitle>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="text-green-500 w-20 h-20 mb-4" />
              <div className="text-2xl mb-2 text-center">
                Broadcast Added to Queue!
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Your broadcast message has been successfully added to the
                sending queue. Messages will be delivered to recipients shortly.
              </div>
            </div>
            <div className="flex gap-4 mt-8 justify-center">
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                Schedule Broadcast
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center">
                <Clock className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <div className="text-base text-gray-700 dark:text-gray-200">
                  Select when to send your broadcast message
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                      How it works:
                    </div>
                    <div>
                      Your message will be scheduled and added to the sending
                      queue. It will be automatically delivered to all
                      recipients at the specified time.
                    </div>
                  </div>
                </div>
              </div>

              <div>
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
            </div>
            <DialogFooter>
              <div className="flex gap-3 justify-center w-full mt-6">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    disabled={loading}
                    onClick={onClose}
                    size="lg"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  disabled={loading || !isDateValid}
                  onClick={() => {
                    // Go back to step 1 with the selected date for confirmation
                    setCurrentStep(1);
                  }}
                  size="lg"
                >
                  Continue to Confirmation
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Step 4: Failure Dialog */}
      {currentStep === 4 && (
        <Dialog
          open={isOpen && currentStep === 4}
          onOpenChange={(open) => {
            if (!open) {
              setCurrentStep(1);
              setResult(null);
            }
          }}
        >
          <DialogContent className="">
            <DialogTitle asChild>
              <VisuallyHidden>Broadcast Failed</VisuallyHidden>
            </DialogTitle>
            <div className="flex flex-col items-center">
              <XCircle className="text-red-500 w-20 h-20 mb-4" />
              <div className="text-2xl mb-2 text-center text-red-600 dark:text-red-400">
                Broadcast Failed
              </div>
              {result?.error && (
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-4 h-4 inline mr-2 text-red-500" />
                  {result.error}
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-8">
              <Button type="button" size="lg" onClick={handleRetry}>
                Try Again
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleReset}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
