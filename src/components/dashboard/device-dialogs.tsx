'use client';

// Import only the types - don't try to use the component directly in this file
import { DeviceConnectionDialogProps } from './device-connection-dialog';
// Import the default export for use in our components
import DCDialog from './device-connection-dialog';

export function AddDeviceDialog(props: DeviceConnectionDialogProps) {
  return <DCDialog {...props} />;
}

export function ReconnectDeviceDialog(props: DeviceConnectionDialogProps) {
  return <DCDialog {...props} isReconnect={true} skipPolicy={true} />;
}

// Re-export the default export as a named export
export { default as DeviceConnectionDialog } from './device-connection-dialog';
