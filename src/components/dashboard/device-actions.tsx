'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Device } from '@/types/device';
import { cn } from '@/lib/utils';
import { RefreshCw, Link, Link2Off, Trash2, Info } from 'lucide-react';

interface DeviceActionsProps {
  device: Device;
  onDeviceAction: (action: string, deviceId: string) => void;
  onOpenDetails: () => void;
}

export default function DeviceActions({
  device,
  onDeviceAction,
  onOpenDetails,
}: DeviceActionsProps) {
  return (
    <div className="flex flex-col space-y-3">
      {/* Main actions row */}
      <div className="flex gap-3 justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenDetails}
                className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-200 hover:scale-[1.03] transition-all hover:shadow-md hover:border-blue-400 focus-visible:ring-blue-500/30"
              >
                <Info className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-1">Details</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View device details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeviceAction('checkStatus', device.id)}
                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border-emerald-200 hover:scale-[1.03] transition-all hover:shadow-md hover:border-emerald-400 focus-visible:ring-emerald-500/30"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-1">
                  Check Status
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Check connection status</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Secondary actions row */}
      <div className="flex gap-3 justify-between">
        {device.status === 'disconnected' || device.status === 'expired' ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeviceAction('reconnect', device.id)}
                  className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-200 hover:scale-[1.03] transition-all hover:shadow-md hover:border-green-400 focus-visible:ring-green-500/30"
                >
                  <Link className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only md:ml-1">
                    Reconnect
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reconnect this device</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeviceAction('disconnect', device.id)}
                  className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border-amber-200 hover:scale-[1.03] transition-all hover:shadow-md hover:border-amber-400 focus-visible:ring-amber-500/30"
                >
                  <Link2Off className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only md:ml-1">
                    Disconnect
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Disconnect this device</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeviceAction('delete', device.id)}
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 border-red-200 hover:scale-[1.03] transition-all hover:shadow-md hover:border-red-400 focus-visible:ring-red-500/30 relative"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-1">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete this device</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
