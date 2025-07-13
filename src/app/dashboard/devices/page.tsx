'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import DeviceList from '@/components/dashboard/device-list';
import { Device } from '@/types/device';
import ClientDeviceDialogs from '@/components/dashboard/client-device-dialogs';
import { deviceService } from '@/services/device.service';
import { useConfirm } from '@/context';
import { toast } from 'sonner';

export default function DevicesPage() {
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [connectedDevices, setConnectedDevices] = useState(0);
  const { confirmDanger, confirmWarning } = useConfirm();

  const maxDevices = 1;

  const handleDeviceAction = async (action: string, deviceId: string) => {
    console.log(`Action ${action} on device ${deviceId}`);

    // Function to refresh the device list
    const refreshDeviceList = () => {
      const deviceListComponent = document.querySelector(
        'div[data-refresh-trigger]'
      );
      if (deviceListComponent) {
        const refreshButton = deviceListComponent.querySelector('button');
        if (refreshButton) {
          refreshButton.click();
        }
      }
    };

    // Handle different device actions
    switch (action) {
      case 'reconnect':
        try {
          // No need to fetch device details first, just use the ID
          setSelectedDevice({ id: deviceId } as Device);
          setIsReconnecting(true);
          setAddDeviceDialogOpen(true);
        } catch (error) {
          console.error('Failed to initiate device reconnection:', error);
          toast.error('Failed to initiate device reconnection');
        }
        break;

      case 'disconnect':
        // Show confirmation dialog before disconnecting
        const disconnectConfirmed = await confirmWarning(
          'Disconnect Device?',
          'This will disconnect the device from your account. You can reconnect it later.',
          'Disconnect'
        );

        if (disconnectConfirmed) {
          try {
            const success = await deviceService.disconnectDevice(deviceId);
            if (success) {
              toast.success('Device disconnected successfully');
              refreshDeviceList();
            }
          } catch (error) {
            console.error('Failed to disconnect device:', error);
            toast.error('Failed to disconnect device');
          }
        }
        break;

      case 'delete':
        // Show confirmation dialog before deleting
        const deleteConfirmed = await confirmDanger(
          'Delete Device?',
          'This action cannot be undone. This will permanently remove the device from your account.',
          'Delete'
        );

        if (deleteConfirmed) {
          try {
            const success = await deviceService.deleteDevice(deviceId);
            if (success) {
              toast.success('Device deleted successfully');
              refreshDeviceList();
            }
          } catch (error) {
            console.error('Failed to delete device:', error);
            toast.error('Failed to delete device');
          }
        }
        break;

      case 'checkStatus':
        // Refresh the list to check status
        refreshDeviceList();
        toast.info('Checking device status...');
        break;

      default:
        console.log(`Action ${action} not implemented yet`);
        toast.info(`Action ${action} not implemented yet`);
    }
  };

  // Handle opening the add device dialog
  const handleAddDevice = () => {
    if (connectedDevices < maxDevices) {
      setAddDeviceDialogOpen(true);
    }
  };

  // Callback to update the connected devices count
  const updateConnectedDevicesCount = (devices: Device[]) => {
    const connected = devices.filter((d) => d.status === 'connected').length;
    setConnectedDevices(connected);
  };

  // Refresh device list after successful reconnection
  const handleSuccessfulReconnect = () => {
    const deviceListComponent = document.querySelector(
      'div[data-refresh-trigger]'
    );
    if (deviceListComponent) {
      const refreshButton = deviceListComponent.querySelector('button');
      if (refreshButton) {
        refreshButton.click();
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Devices</h1>
          <p className="text-muted-foreground mt-1">
            Manage your connected devices across all platforms
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {connectedDevices} of {maxDevices} devices connected
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex gap-2 items-center"
                  onClick={handleAddDevice}
                  disabled={connectedDevices >= maxDevices}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Device</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {connectedDevices >= maxDevices
                  ? 'Maximum devices reached'
                  : 'Connect a new device'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <DeviceList
        onDeviceAction={handleDeviceAction}
        onAddDevice={handleAddDevice}
        onDevicesUpdate={updateConnectedDevicesCount}
      />

      {/* Client-side only dialogs to prevent hydration errors */}
      <ClientDeviceDialogs
        addDialogOpen={addDeviceDialogOpen}
        onAddDialogChange={(open) => {
          setAddDeviceDialogOpen(open);
          // When closing, reset the reconnection flag
          if (!open) {
            setIsReconnecting(false);
          }
        }}
        reconnectDialogOpen={isReconnecting && addDeviceDialogOpen}
        onReconnectDialogChange={(open) => {
          setAddDeviceDialogOpen(open);
          if (!open) {
            setIsReconnecting(false);
          }
        }}
        maxDevices={maxDevices}
        connectedDevices={connectedDevices}
        deviceToReconnect={selectedDevice}
        onSuccessfulAction={handleSuccessfulReconnect}
      />
    </div>
  );
}
