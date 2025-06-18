'use client';

import { useState } from 'react';
import { QrCode, ShieldCheck, AlertCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddDeviceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  maxDevices: number;
  connectedDevices: number;
}

// Privacy policy and security rules text
const policyContent = {
  title: 'Device Connection Policy',
  description:
    'Please read and agree to the following security guidelines before connecting a new device.',
  rules: [
    {
      title: 'Secure Device Usage',
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      content:
        'Only scan QR codes on devices that you personally own or fully trust. Never use shared or public computers for primary authentication.',
    },
    {
      title: 'QR Code Privacy',
      icon: <QrCode className="h-5 w-5 text-primary" />,
      content:
        'Never share your connection QR code with anyone. This code grants full access to your account.',
    },
    {
      title: 'Regular Review',
      icon: <AlertCircle className="h-5 w-5 text-primary" />,
      content:
        'Regularly review your connected devices and remove any that you no longer use or recognize.',
    },
  ],
  additionalTerms:
    'By clicking "I Understand & Agree" you acknowledge that you have read and understood these security guidelines. You also agree to take full responsibility for the security of devices you connect to your account.',
};

export default function AddDeviceDialog({
  isOpen,
  onOpenChange,
  maxDevices,
  connectedDevices,
}: AddDeviceDialogProps) {
  // We need to track which stage of the flow we're in
  // Stage 1: Policy confirmation
  // Stage 2: QR code display
  const [flowStage, setFlowStage] = useState<'policy' | 'qrcode'>('policy');

  // Handle policy confirmation
  const handlePolicyConfirm = () => {
    setFlowStage('qrcode');
  };

  // Handle closing of the dialog
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset to policy stage for next open
      setTimeout(() => {
        setFlowStage('policy');
      }, 300); // Small delay to ensure animation completes before switching content
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      {flowStage === 'policy' ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span>{policyContent.title}</span>
            </DialogTitle>
            <DialogDescription>{policyContent.description}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] p-1 -mx-1">
            <div className="space-y-6 py-4">
              {policyContent.rules.map((rule, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">{rule.icon}</div>
                  <div>
                    <h3 className="font-medium">{rule.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rule.content}
                    </p>
                  </div>
                </div>
              ))}

              <div
                className={cn(
                  'mt-6 p-4 border rounded text-sm text-muted-foreground',
                  'bg-muted/50 border-muted'
                )}
              >
                {policyContent.additionalTerms}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-auto"
            >
              Cancel
            </Button>
            <Button onClick={handlePolicyConfirm}>I Understand & Agree</Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              <span>Connect Your Device</span>
            </DialogTitle>
            <DialogDescription>
              Scan this QR code with your device to establish a secure
              connection.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-6">
            <div className="bg-white p-3 rounded-lg">
              <QrCode className="h-48 w-48 text-primary" />{' '}
              {/* Placeholder - in a real app this would be an actual QR code */}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {connectedDevices} of {maxDevices} devices connected
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="sm:ml-auto gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
