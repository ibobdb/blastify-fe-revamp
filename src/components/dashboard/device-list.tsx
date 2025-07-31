'use client';

import { useEffect, useState } from 'react';
import {
  Device,
  ApiDevice,
  mapApiStatusToUiStatus,
  formatLastActive,
} from '@/types/device';
import DeviceCard from './device-card';
import { Smartphone, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deviceService } from '@/services/device.service';
import { Card } from '@/components/ui/card';
import { DataLoading, DataLoadingWrapper } from '@/components/ui/loading';

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
  const [usingMockData, setUsingMockData] = useState<boolean>(false); // Fetch device data from API
  const fetchDevices = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedDevices = await deviceService.getAllDevices();
      console.log('Fetched devices:', fetchedDevices);
      if (fetchedDevices && fetchedDevices.length > 0) {
        setDevices(fetchedDevices);

        // Notify parent component about updated devices
        if (onDevicesUpdate) {
          onDevicesUpdate(fetchedDevices);
        }
      } else {
        // If we get an empty array but no error, show empty state
        setDevices([]);
        setUsingMockData(false);

        if (onDevicesUpdate) {
          onDevicesUpdate([]);
        }
      }
    } catch (err) {
      setError('Failed to load device data. Using fallback data instead.');

      // Get fallback data from the service (it already handles the fallback internally)
      const fallbackDevices = await deviceService.getAllDevices();
      setDevices(fallbackDevices);
      setUsingMockData(true);

      // Notify parent component about fallback data
      if (onDevicesUpdate) {
        onDevicesUpdate(fallbackDevices);
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
      <div
        className="flex justify-between items-center mb-6"
        data-refresh-trigger
      >
        {/* <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button> */}
      </div>
      <DataLoadingWrapper
        isLoading={loading}
        loadingText="Fetching device data from API..."
        fullScreen={false}
        size="lg"
      >
        <>
          {devices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onDeviceAction={onDeviceAction}
                />
              ))}
            </div>
          ) : (
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
      </DataLoadingWrapper>
    </div>
  );
}
