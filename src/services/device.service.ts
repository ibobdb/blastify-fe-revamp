// Mock device service
import {
  Device,
  ApiDevice,
  ApiDeviceStatus,
  DeviceStatus,
  DeviceType,
} from '@/types/device';

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
   * Mock get client status information
   */
  getClientStatus: async (): Promise<ClientResponse> => {
    await mockDelay();
    return {
      status: true,
      message: 'Client status retrieved',
      data: {
        clientId: '1',
        status: 'CONNECTED',
        lastActive: new Date().toISOString(),
      },
    };
  },

  /**
   * Mock get all devices
   */
  getAllDevices: async (): Promise<Device[]> => {
    await mockDelay();
    return mockDevices;
  },

  /**
   * Mock get device by ID
   */
  getDeviceById: async (id: string): Promise<Device | null> => {
    await mockDelay();
    const device = mockDevices.find((d) => d.id === id);
    return device || null;
  },
  /**
   * Mock create new device
   */
  createDevice: async (deviceData: Partial<Device>): Promise<Device> => {
    await mockDelay();
    const newDevice: Device = {
      id: Math.random().toString(36).substring(2, 9),
      name: deviceData.name || 'New Device',
      status: deviceData.status || 'connected',
      type: deviceData.type || 'mobile',
      lastActive: new Date().toISOString(),
      isActive: true,
      connectedDate: new Date().toISOString(),
    };

    // In a real app, we would add this to the array
    // Here we just return the new device
    return newDevice;
  },

  /**
   * Mock update device
   */
  updateDevice: async (
    id: string,
    deviceData: Partial<Device>
  ): Promise<Device> => {
    await mockDelay();
    const deviceIndex = mockDevices.findIndex((d) => d.id === id);
    if (deviceIndex === -1) {
      throw new Error('Device not found');
    }

    // In a real app, we would update the array
    // Here we just return the updated device
    return {
      ...mockDevices[deviceIndex],
      ...deviceData,
    };
  },

  /**
   * Mock delete device
   */
  deleteDevice: async (id: string): Promise<boolean> => {
    await mockDelay();
    // In a real app, we would remove from the array
    return true;
  },
};
