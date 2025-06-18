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
          <DialogTitle className="flex items-center gap-2">
            {device.type === 'mobile' ? (
              <Smartphone className="h-5 w-5" />
            ) : (
              <Monitor className="h-5 w-5" />
            )}
            <span>{device.name}</span>
          </DialogTitle>
          <DialogDescription>
            View detailed information and connection status
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center p-4">
            <div className="border border-muted p-4 rounded-md">
              <QrCode className="h-32 w-32 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm flex justify-between">
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
            </p>
            <p className="text-sm flex justify-between">
              <span className="text-muted-foreground">Last active:</span>
              <span>{device.lastActive}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="text-muted-foreground">Connected date:</span>
              <span>{new Date(device.connectedDate).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
