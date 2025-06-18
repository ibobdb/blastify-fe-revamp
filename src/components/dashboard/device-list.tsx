'use client';

import { useEffect, useState } from 'react';
import {
  Device,
  ApiDevice,
  mockDevices,
  mapApiStatusToUiStatus,
  formatLastActive,
} from '@/types/device';
import DeviceCard from './device-card';
import { Smartphone, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deviceService } from '@/services/device.service';
import { Card } from '@/components/ui/card';

interface DeviceListProps {
  devices?: Device[]; // Make this optional since we will fetch data
  onDeviceAction: (action: string, deviceId: string) => void;
  onAddDevice?: () => void;
  onDevicesUpdate?: (devices: Device[]) => void;
}

export default function DeviceList({
  devices: initialDevices,
  onDeviceAction,
  onAddDevice,
  onDevicesUpdate,
}: DeviceListProps) {
  const [devices, setDevices] = useState<Device[]>(initialDevices || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  // Fetch device data from API
  const fetchDevices = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await deviceService.getClientStatus();

      if (response.status) {
        const apiDevice = response.data;

        // Convert API response to our Device format
        const deviceFromApi: Device = {
          id: apiDevice.clientId,
          name: `Device - ${apiDevice.clientId.substring(0, 8)}`, // Using part of the ID as name
          status: mapApiStatusToUiStatus(apiDevice.status),
          type: 'mobile', // Default type since API doesn't specify
          lastActive: formatLastActive(apiDevice.lastActive),
          isActive: apiDevice.status === 'CONNECTED',
          connectedDate: apiDevice.lastActive, // Using lastActive as the connected date
        };

        const updatedDevices = [deviceFromApi];
        setDevices(updatedDevices);
        setUsingMockData(false);

        // Notify parent component about updated devices
        if (onDevicesUpdate) {
          onDevicesUpdate(updatedDevices);
        }
      } else {
        throw new Error('Failed to fetch device data');
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to load device data. Using mock data instead.');

      // Fallback to mock data if API fails
      setDevices(mockDevices);
      setUsingMockData(true);

      // Notify parent component about fallback to mock data
      if (onDevicesUpdate) {
        onDevicesUpdate(mockDevices);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchDevices();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          {usingMockData && (
            <div className="flex items-center text-amber-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              Using mock data. Click refresh to try again.
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <Card className="p-8 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
            <h3 className="text-lg font-medium">Loading devices...</h3>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onDeviceAction={onDeviceAction}
              />
            ))}
          </div>

          {devices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-muted/50 p-6 rounded-full">
                <Smartphone className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No devices found</h3>
              <p className="text-muted-foreground text-center max-w-sm mt-2">
                You haven't connected any devices yet. Click "Add Device" to get
                started.
              </p>
              <Button className="mt-4" onClick={onAddDevice}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Device
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
