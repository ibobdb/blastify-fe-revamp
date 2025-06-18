export type DeviceStatus = 'connected' | 'disconnected' | 'expired';
export type DeviceType = 'mobile' | 'desktop';
export type ApiDeviceStatus =
  | 'IDLE'
  | 'INITIALIZING'
  | 'CONNECTED'
  | 'DISCONNECTED';

export interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  type: DeviceType;
  lastActive: string;
  isActive: boolean;
  connectedDate: string;
}

export interface ApiDevice {
  clientId: string;
  status: ApiDeviceStatus;
  lastActive: string;
}

// Function to convert API status to UI status
export function mapApiStatusToUiStatus(
  apiStatus: ApiDeviceStatus
): DeviceStatus {
  switch (apiStatus) {
    case 'CONNECTED':
      return 'connected';
    case 'DISCONNECTED':
      return 'disconnected';
    case 'IDLE':
    case 'INITIALIZING':
    default:
      return 'expired'; // Using expired as a fallback for unknown states
  }
}

// Function to format the lastActive timestamp to a human-readable format
export function formatLastActive(lastActive: string): string {
  const lastActiveDate = new Date(lastActive);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffMs = now.getTime() - lastActiveDate.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  // Format based on time difference
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}

// Mock data for devices
export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'WhatsApp - iPhone',
    status: 'connected',
    type: 'mobile',
    lastActive: 'Just now',
    isActive: true,
    connectedDate: '2025-06-10T10:30:00Z',
  },
  {
    id: '2',
    name: 'WhatsApp - Web',
    status: 'disconnected',
    type: 'desktop',
    lastActive: '2 hours ago',
    isActive: false,
    connectedDate: '2025-06-15T08:45:00Z',
  },
  {
    id: '3',
    name: 'Telegram - Galaxy S22',
    status: 'expired',
    type: 'mobile',
    lastActive: '3 days ago',
    isActive: false,
    connectedDate: '2025-05-30T14:20:00Z',
  },
];

export function getStatusColor(status: DeviceStatus) {
  switch (status) {
    case 'connected':
      return 'bg-green-500/20 text-green-600 border-green-500 dark:text-green-400';
    case 'disconnected':
      return 'bg-yellow-500/20 text-yellow-600 border-yellow-500 dark:text-yellow-400';
    case 'expired':
      return 'bg-red-500/20 text-red-600 border-red-500 dark:text-red-400';
    default:
      return '';
  }
}
