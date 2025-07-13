'use client';

import { useState, useEffect } from 'react';
import {
  AddDeviceDialog,
  DeviceConnectionDialog,
  ReconnectDeviceDialog,
} from './device-dialogs';
import { Device } from '@/types/device';

interface ClientDialogsProps {
  addDialogOpen?: boolean;
  onAddDialogChange?: (open: boolean) => void;
  reconnectDialogOpen?: boolean;
  onReconnectDialogChange?: (open: boolean) => void;
  deviceToReconnect?: Device | null;
  onSuccessfulAction?: () => void;
  maxDevices?: number;
  connectedDevices?: number;
}

/**
 * A client-side only wrapper for device dialogs to prevent hydration errors.
 * This component doesn't render anything during SSR, ensuring no mismatch.
 */
export default function ClientDeviceDialogs({
  addDialogOpen = false,
  onAddDialogChange,
  reconnectDialogOpen = false,
  onReconnectDialogChange,
  deviceToReconnect,
  onSuccessfulAction,
  maxDevices,
  connectedDevices,
}: ClientDialogsProps) {
  // Only render on client side
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return null during SSR and initial render
    return null;
  }

  return (
    <>
      {/* Add Device Dialog */}
      {addDialogOpen !== undefined && onAddDialogChange && (
        <AddDeviceDialog
          isOpen={addDialogOpen}
          onOpenChange={onAddDialogChange}
          maxDevices={maxDevices}
          connectedDevices={connectedDevices}
          onSuccessfulAction={onSuccessfulAction}
        />
      )}

      {/* Reconnect Device Dialog */}
      {reconnectDialogOpen !== undefined &&
        onReconnectDialogChange &&
        deviceToReconnect && (
          <ReconnectDeviceDialog
            isOpen={reconnectDialogOpen}
            onOpenChange={onReconnectDialogChange}
            deviceToReconnect={deviceToReconnect}
            onSuccessfulAction={onSuccessfulAction}
          />
        )}
    </>
  );
}
