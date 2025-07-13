// Device service
import {
  Device,
  ApiDevice,
  ApiDeviceStatus,
  DeviceStatus,
  DeviceType,
  mapApiStatusToUiStatus,
} from '@/types/device';
import api from '@/services/api';
import logger from '@/utils/logger';

// Create a device-specific logger instance
const deviceLogger = logger.child('DeviceService');

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
      deviceLogger.info('Fetching client status');

      const response = await api.get('/client');

      deviceLogger.info('Client data retrieved successfully');
      return response.data;
    } catch (error) {
      deviceLogger.error('Error fetching client status', error);

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
      deviceLogger.info('Polling QR code status');

      const response = await api.get('/client/qr');

      deviceLogger.debug('QR code status retrieved successfully');

      return {
        status: response.data.status,
        qrCode: response.data.qrCode,
        message: response.data.message,
      };
    } catch (error) {
      deviceLogger.error('Error polling QR code status', error);

      // Fallback mock for testing
      await mockDelay();

      // Return a mock response with a random status
      // In real implementation, this would come from the API
      const mockStatuses = [
        'INITIALIZING',
        'CONNECTED',
        'DISCONNECTED',
        'IDLE',
      ];
      const randomStatus =
        mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

      return {
        status: randomStatus,
        message: 'Mock QR code status check',
      };
    }
  },

  /**
   * Fetch all devices from the API
   */
  getAllDevices: async (): Promise<Device[]> => {
    try {
      deviceLogger.info('Fetching all devices');

      const response = await api.get('/client');

      deviceLogger.debug('Devices retrieved successfully');

      // Transform API data to match the Device interface
      // Assuming the API returns an array of devices in data.devices
      if (response.data.devices && Array.isArray(response.data.devices)) {
        return response.data.devices.map((apiDevice: any) => ({
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
      deviceLogger.error('Error fetching devices', error);

      // Fallback to mock data if the API call fails
      await mockDelay();
      return mockDevices;
    }
  },

  /**
   * Get device by ID
   */
  getDeviceById: async (id: string): Promise<Device | null> => {
    try {
      deviceLogger.info(`Fetching device with ID: ${id}`);

      const response = await api.get(`/client/${id}`);

      deviceLogger.debug(`Device ${id} retrieved successfully`);

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
      deviceLogger.error(`Error fetching device ${id}`, error);

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
      deviceLogger.info('Creating new device via API connection');

      const response = await api.post('/client/connect');
      deviceLogger.info('Device created successfully', {
        messageId: response.data?.messageId,
      });

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
      console.error('Error creating device:', error);

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
      deviceLogger.info(`Updating device with ID: ${id}`, {
        fields: Object.keys(deviceData),
      });

      const response = await api.put(`/client/${id}`, deviceData);

      deviceLogger.info('Device updated successfully', {
        deviceId: id,
        messageId: response.data?.messageId,
      });

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
      deviceLogger.error(`Error updating device ${id}`, error);

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
      deviceLogger.info(`Deleting device with ID: ${id}`);

      const response = await api.delete(`/client/${id}`);

      deviceLogger.info('Device deleted successfully', {
        deviceId: id,
        messageId: response.data?.messageId,
      });

      return true;
    } catch (error) {
      deviceLogger.error(`Error deleting device ${id}`, error);

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
      deviceLogger.info(`Disconnecting device with ID: ${deviceId}`);

      const response = await api.post('/client/disconnect', { deviceId });

      deviceLogger.info('Device disconnected successfully', {
        messageId: response.data?.messageId,
        deviceId,
      });

      return true;
    } catch (error) {
      deviceLogger.error('Error disconnecting device', { error, deviceId });
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
      deviceLogger.info('Initiating device connection');

      const response = await api.post('/client/connect');

      deviceLogger.info('Device connection initiated successfully');

      return {
        success: true,
        qrCode: response.data.qrCode, // Expected from API
        message: response.data.message,
      };
    } catch (error) {
      deviceLogger.error('Error connecting device', error);

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
