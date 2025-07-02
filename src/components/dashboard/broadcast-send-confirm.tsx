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
          status: isScheduled ? true : false,
          date: isScheduled ? new Date(selectedDate ?? Date.now()) : new Date(),
        });

        // Handle the response
        if (response && typeof response === 'object' && 'success' in response) {
          setResult(response);
          setCurrentStep(response.success ? 2 : 4); // Step 2 for success, Step 4 for failure
        } else {
          // If no response object, assume success (backward compatibility)
          setResult({ success: true, message: 'Broadcast sent successfully!' });
          setCurrentStep(2);
        }
      } else {
        // If no onConfirm handler, assume success
        setResult({ success: true, message: 'Broadcast sent successfully!' });
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
      onClose(); // close step 1 dialog
    }
  };

  const handleSuccessClose = () => {
    setCurrentStep(1);
    setResult(null);
  };

  const handleReset = () => {
    setCurrentStep(1);
    isScheduled = false;
    setSelectedDate(null);
    setIsDateValid(false);
    setResult(null);
    if (onReset) onReset();
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
            message: 'Broadcast scheduled successfully!',
          });
          setCurrentStep(2);
        }
      } else {
        // If no onConfirm handler, assume success
        setResult({
          success: true,
          message: 'Broadcast scheduled successfully!',
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
      onClose(); // close step 3 dialog
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
                {result?.message || 'Broadcast sent successfully!'}
              </div>
              {result?.message && (
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  {result.message}
                </div>
              )}
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
