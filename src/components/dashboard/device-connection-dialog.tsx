'use client';

import { useEffect, useRef, useState } from 'react';
import { QrCode, ShieldCheck, AlertCircle, X, Loader2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import ClientOnly from '@/components/client-only';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { deviceService } from '@/services/device.service';
import { Progress } from '@/components/ui/progress';
import { Device } from '@/types/device';

// Constants for QR code polling - moved outside component
const QR_POLL_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 3; // 3 retries per QR code
const TOTAL_POLL_TIME = QR_POLL_INTERVAL * MAX_RETRIES; // 15 seconds total polling time

export interface DeviceConnectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  maxDevices?: number;
  connectedDevices?: number;
  isReconnect?: boolean;
  deviceToReconnect?: Device | null;
  onSuccessfulAction?: () => void;
  title?: string;
  description?: string;
  skipPolicy?: boolean;
  customSuccessMessage?: string;
}

// Helper function to process QR code data - only runs on client
const processQRCodeData = (data: string): string => {
  // This function will only be called in the client component inside ClientOnly

  // Check if data is a base64 string that needs to be decoded
  if (data.match(/^[A-Za-z0-9+/=]+$/) && !data.includes(':')) {
    try {
      // Try to decode base64 to see if it's a URL or connection string
      const decoded = atob(data);
      // If it looks like a URL or connection string, return the decoded value
      if (decoded.startsWith('http') || decoded.includes('://')) {
        return decoded;
      }
    } catch (e) {
      // If decoding fails, use the original string
      console.error('Failed to decode base64:', e);
    }
  }

  // Return the original string if it doesn't need processing
  return data;
};

// Privacy policy and security rules text
const policyContent = {
  title: 'Device Connection Policy',
  description:
    'Please read and agree to the following security guidelines before connecting a new device.',
  rules: [
    {
      title: 'Secure Device Usage',
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      content:
        'Only scan QR codes on devices that you personally own or fully trust. Never use shared or public computers for primary authentication.',
    },
    {
      title: 'QR Code Privacy',
      icon: <QrCode className="h-5 w-5 text-primary" />,
      content:
        'Never share your connection QR code with anyone. This code grants full access to your account.',
    },
    {
      title: 'Regular Review',
      icon: <AlertCircle className="h-5 w-5 text-primary" />,
      content:
        'Regularly review your connected devices and remove any that you no longer use or recognize.',
    },
  ],
  additionalTerms:
    'By clicking "I Understand & Agree" you acknowledge that you have read and understood these security guidelines. You also agree to take full responsibility for the security of devices you connect to your account.',
};

interface DeviceActionResult {
  success: boolean;
  qrcode?: string;
  message?: string;
  status?: string;
}

export function DeviceConnectionDialog({
  isOpen,
  onOpenChange,
  maxDevices = 3,
  connectedDevices = 0,
  isReconnect = false,
  deviceToReconnect,
  onSuccessfulAction,
  title,
  description,
  skipPolicy = false,
  customSuccessMessage,
}: DeviceConnectionDialogProps) {
  // All state initialized with server-safe values
  // We don't use the computed initialStage directly in useState to avoid hydration issues
  // State for managing the dialog flow and QR code
  const [flowStage, setFlowStage] = useState<'policy' | 'qrcode'>('policy');
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null); // Handle device action (either connect new device or reconnect existing device)
  const initiateDeviceAction = async () => {
    setIsLoading(true);

    // First, ensure we stop any existing polling
    stopPolling();

    // Set device status to initializing when starting the action
    setDeviceStatus('INITIALIZING');

    try {
      let result: DeviceActionResult;
      console.log(
        `Initiating device ${isReconnect ? 'reconnection' : 'connection'}`
      );

      // Call appropriate API based on whether this is a reconnect or new connection
      if (isReconnect && deviceToReconnect) {
        // For reconnection
        result = await deviceService.reconnectDevice(deviceToReconnect.id);
        console.log('Reconnect API result:', result);
      } else {
        // For new device connection
        result = await deviceService.connectDevice();
        console.log('Connect API result:', result);
      }

      if (result.success) {
        // If the API returns QR code data, set it
        const qrCodeValue = result.qrcode;
        if (qrCodeValue) {
          // Store the original QR code data
          console.log('Setting QR code data from action result');
          setQrCodeData(qrCodeValue);
        }

        // Show success message
        if (result.message) {
          toast.success(result.message);
        } else {
          toast.success(
            `Device ${
              isReconnect ? 'reconnection' : 'connection'
            } initiated successfully`
          );
        }

        // Start polling, with a small delay to ensure state is set properly
        setTimeout(() => {
          if (!isPolling) {
            console.log('Starting polling after successful action');
            startPolling();
          }
        }, 100);
      } else {
        toast.error(
          `Failed to ${isReconnect ? 'reconnect' : 'connect'} device`
        );
      }
    } catch (error) {
      console.error('Error with device action:', error);
      toast.error(
        `Failed to ${
          isReconnect ? 'reconnect' : 'connect'
        } device. Please try again.`
      );

      // Even on error, try starting polling if we have a QR code
      // This helps recover from transient errors
      if (qrCodeData && !isPolling) {
        setTimeout(() => startPolling(), 1000);
      }
    } finally {
      setIsLoading(false);
    }
  }; // Poll QR code status from the API with improved error handling
  const pollQrCodeStatus = async () => {
    // Only run on client side
    if (!isClient) return;

    // Skip if we're not supposed to be polling anymore
    if (!isPolling && pollTimerRef.current === null) return;

    try {
      // Set loading state when starting a poll request
      setIsLoading(true);
      console.log(`Polling QR code status... (isReconnect: ${isReconnect})`);

      // Call the API endpoint to get QR status with timeout
      let response;
      try {
        // Standard API call
        response = await deviceService.pollQrCode();
        console.log('Polling QR code response:', response);
      } catch (apiError) {
        console.error('API error during polling:', apiError);
        // If API call fails, we'll continue polling next time
        setIsLoading(false);
        return;
      }

      // Type assertion to handle potential qrcode property
      const responseWithPossibleQrcode = response as {
        qrCode?: string;
        status: string;
        message?: string;
      };

      const qrCodeValue = responseWithPossibleQrcode.qrCode;
      if (qrCodeValue) {
        // Store the original QR code data
        console.log('Setting new QR code data');
        setQrCodeData(qrCodeValue);
      }

      // Update the device status
      console.log(`Device status update: ${response.status}`);
      setDeviceStatus(response.status);

      // If the device is connected, stop polling and close the dialog
      if (response.status === 'CONNECTED') {
        stopPolling();

        // Use custom success message if provided, otherwise use default messages
        if (customSuccessMessage) {
          toast.success(customSuccessMessage);
        } else if (isReconnect && deviceToReconnect) {
          toast.success(
            `Device "${deviceToReconnect.name}" reconnected successfully!`
          );
        } else {
          toast.success('Device connected successfully!');
        }

        // Call the success callback if provided (for refreshing device list, etc.)
        if (onSuccessfulAction) {
          onSuccessfulAction();
        }

        setTimeout(() => {
          onOpenChange(false);
        }, 1500); // Give the user a moment to see the success message
        return;
      } // If the device is disconnected, also stop polling and close the dialog
      if (response.status === 'DISCONNECTED') {
        stopPolling();

        // Show a disconnected message
        toast.error(
          isReconnect && deviceToReconnect
            ? `Device "${deviceToReconnect.name}" was disconnected.`
            : 'Device was disconnected.'
        );

        // Call the success callback to refresh the device list
        if (onSuccessfulAction) {
          onSuccessfulAction();
        }

        // Close the dialog after a brief delay
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
        return;
      } // If we've reached the maximum retries, generate a new QR code
      if (retryCount >= MAX_RETRIES - 1) {
        console.log('Maximum retries reached, requesting new QR code');
        // Reset progress and retry count
        setProgress(0);
        setRetryCount(0);

        try {
          // Get a new QR code - use the appropriate method based on connection type
          let newQrResult: DeviceActionResult;

          if (isReconnect && deviceToReconnect) {
            console.log('Requesting new reconnection QR code');
            newQrResult = await deviceService.reconnectDevice(
              deviceToReconnect.id
            );
          } else {
            console.log('Requesting new connection QR code');
            newQrResult = await deviceService.connectDevice();
          }

          console.log('New QR code result:', newQrResult);

          const qrCodeValue = newQrResult.qrcode;
          if (newQrResult.success && qrCodeValue) {
            // Store the original QR code data
            setQrCodeData(qrCodeValue);
            toast.info(
              'Generated a new QR code. Please scan with your device.'
            );
          } else {
            console.error('Failed to get new QR code');
            // If we failed to get a new QR code, try again after a delay
            setTimeout(() => pollQrCodeStatus(), 2000);
          }
        } catch (error) {
          console.error('Error getting new QR code:', error);
          // Reset retry count to try again soon
          setRetryCount(MAX_RETRIES - 2);
        }
      } else if (deviceStatus !== 'INITIALIZING') {
        // Only increment retry count if not in initializing state
        setRetryCount((prev) => prev + 1);
        console.log(
          `Retry count incremented to ${retryCount + 1} of ${MAX_RETRIES}`
        );
      }
    } catch (error) {
      console.error('Error polling QR code status:', error);
      toast.error('Failed to check device connection status.');
      stopPolling();
    } finally {
      setIsLoading(false);
    }
  }; // Start the polling process with improved reliability
  const startPolling = () => {
    // Only run on client side
    if (!isClient) return;

    // If already polling, clear existing timers first to prevent duplicates
    if (isPolling) {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    console.log('Starting polling process');
    setIsPolling(true);
    setRetryCount(0);
    setProgress(0);

    // Start the progress timer that updates every 100ms
    // This timer will only update progress when not in INITIALIZING state
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        // Skip progress update if in INITIALIZING state
        if (deviceStatus === 'INITIALIZING') return prev;

        const increment = 100 / (TOTAL_POLL_TIME / 100); // Calculate increment per 100ms
        const newProgress = Math.min(prev + increment, 100);
        return newProgress;
      });
    }, 100);

    // Start the polling timer with error handling
    try {
      pollTimerRef.current = setInterval(() => {
        // Use a try-catch inside the interval to prevent it from breaking
        try {
          pollQrCodeStatus().catch((error) => {
            console.error('Error in polling interval:', error);
            // Continue polling despite errors
          });
        } catch (e) {
          console.error('Unexpected error in polling interval:', e);
        }
      }, QR_POLL_INTERVAL);
    } catch (e) {
      console.error('Failed to set up polling interval:', e);
      // Attempt recovery
      setTimeout(() => {
        if (!isPolling) startPolling();
      }, 1000);
    }

    // Immediately poll once to start (with error handling)
    pollQrCodeStatus().catch((error) => {
      console.error('Error in initial poll:', error);
      // Poll again after a short delay if initial poll fails
      setTimeout(() => pollQrCodeStatus(), 1000);
    });
  }; // Stop the polling process with improved cleanup
  const stopPolling = () => {
    // Only run on client side (and check if window exists for safety)
    if (typeof window === 'undefined') return;

    console.log('Stopping polling process');

    // Clear timers with error handling
    try {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    } catch (e) {
      console.error('Error clearing polling timer:', e);
    }

    try {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    } catch (e) {
      console.error('Error clearing progress timer:', e);
    }

    // Ensure polling state is reset
    setIsPolling(false);
  }; // First useEffect for client-side initialization
  useEffect(() => {
    // Set client state and initialize flowStage only on the client side
    setIsClient(true);

    // Set the correct initial stage based on props
    const initialStage = isReconnect || skipPolicy ? 'qrcode' : 'policy';
    setFlowStage(initialStage);
  }, [isReconnect, skipPolicy]); // Monitor dialog state and manage polling
  useEffect(() => {
    // Only run this effect on the client
    if (!isClient) return;

    console.log(
      `Dialog state changed: isOpen=${isOpen}, flowStage=${flowStage}, isPolling=${isPolling}`
    );

    // Start polling when we reach the QR code stage
    if (isOpen && flowStage === 'qrcode') {
      console.log('QR code stage reached, evaluating polling needs');

      // For reconnection, we need to initiate the reconnect process first
      // But only if we have a device to reconnect and no QR code data yet
      if (isReconnect && deviceToReconnect && !qrCodeData && !isPolling) {
        console.log('Starting reconnection process automatically');
        // Set device status to initializing for reconnection
        setDeviceStatus('INITIALIZING');
        initiateDeviceAction();
      }
      // We removed the automatic polling start for non-reconnect flows
      // Now it only starts after policy confirmation via handlePolicyConfirm

      // Recovery mechanism: If we have QR code data but aren't polling, restart polling
      else if (qrCodeData && !isPolling) {
        console.log(
          'QR code exists but no polling active - restarting polling'
        );
        setTimeout(() => startPolling(), 300);
      }
    }

    // If dialog is closed, stop polling
    if (!isOpen) {
      stopPolling();
    }

    // Clean up on unmount or when dialog closes
    return () => {
      if (!isOpen) {
        stopPolling();
      }
    };
  }, [
    isClient,
    isOpen,
    flowStage,
    isReconnect,
    deviceToReconnect,
    qrCodeData,
    isPolling,
  ]);

  // Additional monitoring for polling state to recover from failures
  useEffect(() => {
    if (!isClient) return;

    // Only apply when dialog is open and we're on QR code stage
    if (!isOpen || flowStage !== 'qrcode') return;

    // If we have QR code data and we should be polling but aren't,
    // this indicates the polling might have stopped unexpectedly
    if (
      qrCodeData &&
      !isPolling &&
      deviceStatus !== 'CONNECTED' &&
      deviceStatus !== 'DISCONNECTED'
    ) {
      console.log('Detected polling has stopped unexpectedly - recovering');
      // Restart polling with a small delay
      const recoveryTimer = setTimeout(() => {
        if (!isPolling) startPolling();
      }, 1000);

      return () => clearTimeout(recoveryTimer);
    }
  }, [isClient, isOpen, qrCodeData, isPolling, deviceStatus, flowStage]);
  // Handle policy confirmation
  const handlePolicyConfirm = async () => {
    // First move to QR code stage
    setFlowStage('qrcode');
    // Then initiate the device action
    initiateDeviceAction();
  };

  // Handle closing of the dialog
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Stop polling
      stopPolling();

      // Reset to appropriate stage for next open and clear QR code data
      setTimeout(() => {
        // Determine the stage to return to based on various flags
        const shouldSkipPolicy = isReconnect || skipPolicy;
        setFlowStage(shouldSkipPolicy ? 'qrcode' : 'policy');
        setQrCodeData(null);
        setIsLoading(false);
        setProgress(0);
        setRetryCount(0);
        setDeviceStatus(null);
      }, 300); // Small delay to ensure animation completes before switching content
    }
    onOpenChange(open);
  }; // Determine if the dialog should be closable
  const allowDialogClose =
    !isPolling ||
    deviceStatus === 'DISCONNECTED' ||
    (deviceStatus !== null && deviceStatus !== 'INITIALIZING');

  return (
    <Dialog
      open={isOpen}
      onOpenChange={allowDialogClose ? handleDialogClose : undefined}
    >
      {flowStage === 'policy' ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span>{policyContent.title}</span>
            </DialogTitle>
            <DialogDescription>{policyContent.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 -mx-1">
            <div className="space-y-6 py-4">
              {policyContent.rules.map((rule, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">{rule.icon}</div>
                  <div>
                    <h3 className="font-medium">{rule.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rule.content}
                    </p>
                  </div>
                </div>
              ))}

              <div
                className={cn(
                  'mt-6 p-4 border rounded text-sm text-muted-foreground',
                  'bg-muted/50 border-muted'
                )}
              >
                {policyContent.additionalTerms}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-auto"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handlePolicyConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'I Understand & Agree'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              <span>
                {title
                  ? title
                  : isReconnect
                  ? `Reconnect ${deviceToReconnect?.name || 'Device'}`
                  : 'Connect Your Device'}
              </span>
            </DialogTitle>
            <DialogDescription>
              {description
                ? description
                : isReconnect
                ? 'Scan this QR code with your device to reestablish connection.'
                : 'Scan this QR code with your device to establish a secure connection.'}
            </DialogDescription>
          </DialogHeader>{' '}
          <div className="flex flex-col items-center justify-center p-6">
            <div className="bg-white p-3 rounded-lg">
              <ClientOnly
                fallback={
                  <div className="flex flex-col items-center justify-center h-48 w-48">
                    <QrCode className="h-12 w-12 text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Initializing...
                    </p>
                  </div>
                }
              >
                {() => {
                  // This function will only run on the client side inside ClientOnly
                  if (qrCodeData) {
                    // When QR code data is available
                    return (
                      <QRCode
                        value={processQRCodeData(qrCodeData)}
                        size={192} // Equivalent to h-48 w-48 (192px)
                        level="H" // Highest error correction capability
                        style={{ maxWidth: '100%', height: 'auto' }}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                      />
                    );
                  } else if (isLoading) {
                    // Show loading spinner when fetching
                    return (
                      <div className="flex flex-col items-center justify-center h-48 w-48">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground mt-4">
                          Loading QR code...
                        </p>
                      </div>
                    );
                  } else {
                    // Initializing or no QR code yet
                    return (
                      <div className="flex flex-col items-center justify-center h-48 w-48">
                        <QrCode className="h-12 w-12 text-primary mb-4" />
                        <p className="text-sm text-muted-foreground">
                          {isReconnect
                            ? `Preparing to reconnect device...`
                            : `Waiting for QR code...`}
                        </p>
                      </div>
                    );
                  }
                }}
              </ClientOnly>
            </div>
            {/* Only show device count info if maxDevices is provided */}
            {typeof maxDevices !== 'undefined' &&
              typeof connectedDevices !== 'undefined' && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {connectedDevices} of {maxDevices} devices connected
                </p>
              )}{' '}
            <p className="text-center text-sm text-muted-foreground mt-2">
              {isReconnect
                ? `Scan this QR code with your ${
                    deviceToReconnect?.type === 'desktop'
                      ? 'computer'
                      : 'mobile device'
                  } to reconnect.`
                : `Scan this QR code with your device to complete the connection.`}
            </p>{' '}
            {/* Progress bar for QR code expiration or loading indicator for initializing */}
            <div className="w-full mt-6">
              {deviceStatus === 'INITIALIZING' ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">Connecting...</span>
                  </div>{' '}
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {isReconnect
                      ? `Reconnecting device. Please wait.`
                      : `Device is initializing connection. Please wait.`}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      QR Code expires in:
                    </span>
                    <span className="text-sm font-medium">
                      {Math.max(0, MAX_RETRIES - retryCount)} of {MAX_RETRIES}{' '}
                      attempts
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    QR code will refresh automatically if not scanned in time
                  </p>
                </>
              )}
            </div>
          </div>{' '}
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            {' '}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="sm:ml-auto gap-2"
              disabled={deviceStatus === 'INITIALIZING'}
            >
              <X className="h-4 w-4" />
              {deviceStatus === 'INITIALIZING'
                ? 'Please wait...'
                : deviceStatus === 'DISCONNECTED'
                ? 'Close (Disconnected)'
                : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

// Default export for backward compatibility
export default DeviceConnectionDialog;
