'use client';

import { Smartphone, Monitor, QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Device, getStatusColor } from '@/types/device';
import { cn } from '@/lib/utils';

interface DeviceDetailsDialogProps {
  device: Device;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeviceDetailsDialog({
  device,
  isOpen,
  onOpenChange,
}: DeviceDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Device</DialogTitle>
          <DialogDescription>
            View detailed information and connection status
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant="outline"
                className={cn(
                  'capitalize font-medium',
                  getStatusColor(device.status)
                )}
              >
                {device.status}
              </Badge>
            </div>
            <div className="text-sm flex justify-between">
              <span className="text-muted-foreground">Last active:</span>
              <span>{new Date(device.connectedDate).toLocaleDateString()}</span>
            </div>
            <div className="text-sm flex justify-between">
              <span className="text-muted-foreground">Connected date:</span>
              <span>{new Date(device.connectedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
