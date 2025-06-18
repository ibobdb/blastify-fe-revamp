'use client';

import { useState } from 'react';
import { Smartphone, Monitor, Clock, CalendarClock } from 'lucide-react';
import { Device, getStatusColor } from '@/types/device';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import DeviceActions from '@/components/dashboard/device-actions';
import DeviceDetailsDialog from '@/components/dashboard/device-details-dialog';

interface DeviceCardProps {
  device: Device;
  onDeviceAction: (action: string, deviceId: string) => void;
}

export default function DeviceCard({
  device,
  onDeviceAction,
}: DeviceCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card
      key={device.id}
      className={cn(
        'transition-all duration-300 hover:shadow-md overflow-hidden rounded-xl',
        device.isActive && 'ring-2 ring-primary/50'
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {device.type === 'mobile' ? (
              <Smartphone className="h-6 w-6 text-muted-foreground" />
            ) : (
              <Monitor className="h-6 w-6 text-muted-foreground" />
            )}
            <CardTitle>{device.name}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'capitalize font-medium transition-colors animate-in fade-in-0 zoom-in-95',
              getStatusColor(device.status)
            )}
          >
            {device.status}
          </Badge>
        </div>
        <CardDescription className="pt-2">
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Last active: {device.lastActive}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <span>
                Connected: {new Date(device.connectedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>{' '}
      <div className="px-6 pb-6 pt-2 mt-auto">
        <DeviceActions
          device={device}
          onDeviceAction={onDeviceAction}
          onOpenDetails={() => setIsDialogOpen(true)}
        />
      </div>
      <DeviceDetailsDialog
        device={device}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  );
}
