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
import AddDeviceDialog from '@/components/dashboard/add-device-dialog';
import { Device } from '@/types/device';

export default function DevicesPage() {
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState(0);

  const maxDevices = 3;

  const handleDeviceAction = (action: string, deviceId: string) => {
    // In a real app, these would make API calls to update device status
    console.log(`Action ${action} on device ${deviceId}`);
    // The actual state update will now happen in the DeviceList component
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

      <AddDeviceDialog
        isOpen={addDeviceDialogOpen}
        onOpenChange={setAddDeviceDialogOpen}
        maxDevices={maxDevices}
        connectedDevices={connectedDevices}
      />
    </div>
  );
}
