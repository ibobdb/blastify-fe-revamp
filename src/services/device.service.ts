// Device service
import { Device, ApiDevice, mapApiStatusToUiStatus } from '@/types/device';
import api from '@/services/api';

// Mock delay function to simulate API calls
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock device data
const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Primary Phone',
    status: 'connected',
    type: 'mobile',
    lastActive: new Date().toISOString(),
    isActive: true,
    connectedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: '2',
    name: 'Office Phone',
    status: 'disconnected',
    type: 'mobile',
    lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isActive: false,
    connectedDate: new Date(
      Date.now() - 14 * 24 * 60 * 60 * 1000
    ).toISOString(), // 14 days ago
  },
  {
    id: '3',
    name: 'Marketing Device',
    status: 'expired',
    type: 'desktop',
    lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    isActive: false,
    connectedDate: new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 30 days ago
  },
];

export interface ClientResponse {
  status: boolean;
  message: string;
  data: ApiDevice;
}

export const deviceService = {
  /**
   * Get client status information from the API
   */
  getClientStatus: async (): Promise<ClientResponse> => {
    try {
      const response = await api.get('/client');

      // Handle "Client not found" response
      if (
        response.data.status === false &&
        (response.data.message === 'Client not found' ||
          response.data.code === 'NOT_FOUND')
      ) {
        return {
          status: false,
          message: 'No devices connected',
          data: {
            clientId: '',
            status: 'DISCONNECTED',
            lastActive: new Date().toISOString(),
          },
        };
      }

      return response.data;
    } catch (error) {
      // Fallback to mock data if the API call fails
      await mockDelay();

      // Return mock data that matches the expected response format
      return {
        status: true,
        message: 'Client status retrieved (mock fallback)',
        data: {
          clientId: '2f3265d7-7ea8-4111-97c0-0af3793a26fa',
          status: 'DISCONNECTED',
          lastActive: new Date().toISOString(),
        },
      };
    }
  },

  /**
   * Poll QR code status from the API
   * Returns the current status of the QR code connection process
   * and a new QR code if the previous one expired
   */
  pollQrCode: async (): Promise<{
    status: string;
    qrCode?: string;
    message?: string;
  }> => {
    try {
      const response = await api.get('/client/qr');

      return {
        status: response.data.data?.status || response.data.status,
        qrCode: response.data.data?.qrCode || response.data.qrCode,
        message: response.data.message,
      };
    } catch (error) {
      // Return error status
      return {
        status: 'ERROR',
        message: 'Failed to poll QR code status. Please try again.',
      };
    }
  },
  /**
   * Reconnect an existing device using the API
   * @param deviceId The ID of the device to reconnect
   * @returns Object containing success status, QR code data if needed, and status
   *
   * NOTE: Uses the same endpoint as connectDevice (/client/connect)
   * since the backend handles reconnection through the same flow
   */
  reconnectDevice: async (
    deviceId: string
  ): Promise<{
    success: boolean;
    qrCode?: string;
    message?: string;
    status?: string;
  }> => {
    try {
      // Use the same endpoint as connectDevice
      const response = await api.post('/client/connect', {
        // Include the deviceId for reconnection
        clientId: deviceId,
      });

      // Check if device is immediately connected (no QR needed)
      if (response.data.data?.status === 'CONNECTED') {
        return {
          success: true,
          status: 'CONNECTED',
          message: response.data.message || 'Device reconnected successfully',
        };
      }

      // Otherwise return QR code for scanning
      return {
        success: true,
        qrCode: response.data.data?.qrCode || response.data.qrCode,
        status: response.data.data?.status || response.data.status,
        message: response.data.message,
      };
    } catch (error) {
      // Check if we're in development mode and provide mock data
      if (process.env.NODE_ENV === 'development') {
        // Fallback to mock QR code for testing
        await mockDelay();

        // During testing, randomly decide if device is already connected
        const isAlreadyConnected = Math.random() > 0.7;

        if (isAlreadyConnected) {
          return {
            success: true,
            status: 'CONNECTED',
            message: 'Device reconnected successfully (mock)',
          };
        }

        return {
          success: true,
          qrCode: '', // In a real app, this would be base64 QR code data
          status: 'INITIALIZING',
          message: 'Mock reconnection initiated. Please scan the QR code.',
        };
      } else {
        // In production, return error
        return {
          success: false,
          status: 'ERROR',
          message: 'Failed to reconnect device. Please try again.',
        };
      }
    }
  },

  /**
   * Fetch all devices from the API
   */
  getAllDevices: async (): Promise<Device[]> => {
    try {
      const response = await api.get('/client');
      // Check for the "Client not found" response
      if (
        response.data.data.status === false &&
        (response.data.data.message === 'Client not found' ||
          response.data.data.code === 'NOT_FOUND')
      ) {
        return []; // Return empty array when no clients are connected
      }

      // Transform API data to match the Device interface
      // Check if we have data and convert to array if it's a single object
      if (response.data && response.data.data) {
        const apiDevices = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];

        return apiDevices.map((apiDevice: any) => ({
          id: apiDevice.clientId || apiDevice.id,
          name: apiDevice.name || 'Unknown Device',
          status: mapApiStatusToUiStatus(apiDevice.status),
          type: apiDevice.type || 'desktop',
          lastActive: apiDevice.lastActive || new Date().toISOString(),
          isActive: apiDevice.status === 'CONNECTED',
          connectedDate:
            apiDevice.connectedDate ||
            apiDevice.lastActive ||
            new Date().toISOString(),
        }));
      }

      return [];
    } catch (error) {
      // Fallback to mock data if the API call fails
      // await mockDelay();
      return [];
    }
  },

  /**
   * Get device by ID
   */
  getDeviceById: async (id: string): Promise<Device | null> => {
    try {
      const response = await api.get(`/client/${id}`);

      // Check for the "Client not found" response
      if (
        response.data.status === false &&
        (response.data.message === 'Client not found' ||
          response.data.code === 'NOT_FOUND')
      ) {
        return null;
      }

      if (response.data?.device) {
        // Convert API device to our Device type
        return {
          id: response.data.device.clientId || response.data.device.id,
          name: response.data.device.name || `Device ${id.substring(0, 6)}`,
          status: mapApiStatusToUiStatus(response.data.device.status),
          type: response.data.device.type || 'mobile',
          lastActive:
            response.data.device.lastActive || new Date().toISOString(),
          isActive: response.data.device.status === 'CONNECTED',
          connectedDate:
            response.data.device.connectedDate ||
            response.data.device.lastActive,
        };
      }
      return null;
    } catch (error) {
      // Fallback to mock behavior
      await mockDelay();
      const device = mockDevices.find((d) => d.id === id);
      return device || null;
    }
  },

  /**
   * Create new device by connecting to the API endpoint
   */
  createDevice: async (deviceData: Partial<Device> = {}): Promise<Device> => {
    try {
      const response = await api.post('/client/connect');

      // Convert the API response to a Device object
      return {
        id:
          response.data.clientId || Math.random().toString(36).substring(2, 9),
        name: deviceData.name || response.data.name || 'New Connected Device',
        status: response.data.status
          ? mapApiStatusToUiStatus(response.data.status)
          : 'connected',
        type: deviceData.type || 'mobile',
        lastActive: response.data.lastActive || new Date().toISOString(),
        isActive: true,
        connectedDate: new Date().toISOString(),
      };
    } catch (error) {
      // Fallback to mock device if the API call fails
      await mockDelay();

      // Return a mock device
      return {
        id: Math.random().toString(36).substring(2, 9),
        name: deviceData.name || 'New Device (Offline)',
        status: 'connected',
        type: deviceData.type || 'mobile',
        lastActive: new Date().toISOString(),
        isActive: true,
        connectedDate: new Date().toISOString(),
      };
    }
  },

  /**
   * Update device via API
   */
  updateDevice: async (
    id: string,
    deviceData: Partial<Device>
  ): Promise<Device> => {
    try {
      const response = await api.put(`/client/${id}`, deviceData);

      // Return the updated device from the response
      return {
        ...response.data.device,
        // Ensure we have proper status mapping
        status:
          mapApiStatusToUiStatus(response.data.device?.status) ||
          deviceData.status ||
          'disconnected',
      };
    } catch (error) {
      // Fallback to mock behavior
      await mockDelay();
      const deviceIndex = mockDevices.findIndex((d) => d.id === id);
      if (deviceIndex === -1) {
        throw new Error('Device not found');
      }

      return {
        ...mockDevices[deviceIndex],
        ...deviceData,
      };
    }
  },
  /**
   * Delete device via API
   */
  deleteDevice: async (id: string): Promise<boolean> => {
    try {
      // Using the /client/delete-device endpoint with POST and no payload
      const response = await api.post('/client/delete-device');

      return true;
    } catch (error) {
      // Fallback to mock behavior
      await mockDelay();
      return true;
    }
  },

  /**
   * Disconnect a device using the API
   */
  disconnectDevice: async (deviceId: string): Promise<boolean> => {
    try {
      const response = await api.post('/client/disconnect', { deviceId });

      return true;
    } catch (error) {
      // Fallback to mock success for testing
      await mockDelay();
      return true;
    }
  },

  /**
   * Connect a new device using the API
   * @returns Object containing QR code data if available
   */
  connectDevice: async (): Promise<{
    success: boolean;
    qrCode?: string;
    message?: string;
  }> => {
    try {
      const response = await api.post('/client/connect');

      return {
        success: true,
        qrCode: response.data.qrCode, // Expected from API
        message: response.data.message,
      };
    } catch (error) {
      // Fallback to mock QR code for testing
      await mockDelay();
      return {
        success: true,
        qrCode: '', // In a real app, this would be base64 QR code data
        message: 'Mock connection created successfully',
      };
    }
  },
};
