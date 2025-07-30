'use client';

import { useState } from 'react';
import DeviceList from '@/components/dashboard/device-list';
import { Device } from '@/types/device';
import ClientDeviceDialogs from '@/components/dashboard/client-device-dialogs';
import { deviceService } from '@/services/device.service';
import { useConfirm } from '@/context';
import { toast } from 'sonner';
import { MainPageLayout } from '@/components/dashboard/main-page-layout';

export default function DevicesPage() {
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [connectedDevices, setConnectedDevices] = useState(0);
  const { confirmDanger, confirmWarning } = useConfirm();

  const maxDevices = 1;

  const handleDeviceAction = async (action: string, deviceId: string) => {
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
    <MainPageLayout
      title="Your Devices"
      description="  Manage your connected devices across all platforms"
    >
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
    </MainPageLayout>
  );
}
