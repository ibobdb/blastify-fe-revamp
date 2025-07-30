import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ImportIcon, Loader2Icon } from 'lucide-react';
import { useState, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BroadcastService from '@/services/broadcast.service';
import { deviceService } from '@/services/device.service';
import { useConfirm } from '@/context/confirm.context';
import { toast } from 'sonner';
import { ImportContactResponse } from '@/services/broadcast.service';
interface ImportContactDialogProps {
  className?: string;
  onSubmit?: (data: DataContacts[]) => void;
}
type importStep = '1' | '2' | '3';
type importType = 'device' | 'file';
interface DataContacts {
  name: string;
  number: string;
}
export function ImportContactDialog(props: ImportContactDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataContacts[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [step, setStep] = useState<importStep>('1'); // '1' | '2' | '3'
  const [activeTab, setActiveTab] = useState<importType>('device');
  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Router for navigation
  const router = useRouter();

  // Get confirmation dialog functionality
  const { confirmDanger } = useConfirm();
  useLayoutEffect(() => {
    if (contentRef.current) {
      setContainerHeight(contentRef.current.offsetHeight);
    }
  }, [activeTab, isConfirmed]);

  const onImportFromDeviceClick = async () => {
    setIsLoading(true);

    try {
      // Check client status before importing contacts
      const clientStatus = await deviceService.getClientStatus();

      // If client status is not "CONNECTED", show confirmation dialog before redirect
      if (clientStatus.data.status !== 'CONNECTED') {
        setIsLoading(false); // Stop loading before showing dialog

        confirmDanger(
          'Device Not Connected',
          'Your WhatsApp device is not connected. You need to connect your device first before importing contacts. Would you like to go to the device page to connect?',
          'Go to Device Page',
          () => {
            router.push('/dashboard/devices');
          }
        );
        return;
      }

      // Continue with import process if connected
      const response = await BroadcastService.importContact();
      if (response.status) {
        setData(response.data.contacts || []);
        toast.success(
          `Imported ${response.data.count} contact(s) successfully!`
        );
      }
    } catch (error) {
      console.error('Error importing contacts:', error);
      setIsLoading(false); // Stop loading before showing dialog

      // On error, show confirmation dialog before redirect
      confirmDanger(
        'Connection Error',
        'There was an error checking your device connection. Would you like to go to the device page to check your connection?',
        'Go to Device Page',
        () => {
          router.push('/dashboard/device');
        }
      );
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
    if (props.onSubmit) {
      props.onSubmit(data);
    }
    setIsSubmitting(false);
    setIsConfirmed(false);
    setStep('1');
    setData([]);
    setOpen(false); // Close modal after submit
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={props.className} onClick={() => setOpen(true)}>
        <ImportIcon size={14} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <span className="text-red-400">
              ⚠️ These contacts are retrieved from your linked device. Please
              use this data responsibly.
            </span>
            {data.length > 0 && (
              <span className="block text-green-500">
                Import success, {data.length} contact(s) found.
              </span>
            )}
          </DialogDescription>
          {isConfirmed && (
            <div className="border p-2">
              <Tabs
                defaultValue="device"
                onValueChange={(v) => setActiveTab(v as importType)}
              >
                <TabsList className="bg-gray-200 rounded">
                  <TabsTrigger value="device">Device</TabsTrigger>
                  <TabsTrigger value="file">File</TabsTrigger>
                </TabsList>
                {/* Animated height container */}
                <div
                  style={{
                    height: containerHeight,
                    transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                  }}
                >
                  <div ref={contentRef} className="pt-4">
                    {activeTab === 'device' && (
                      <TabsContent value="device" forceMount>
                        <div className="cursor-pointer">
                          <Button
                            variant={'outline'}
                            onClick={onImportFromDeviceClick}
                            disabled={isLoading || data.length > 0}
                          >
                            {isLoading ? (
                              <Loader2Icon className="animate-spin" />
                            ) : (
                              <ImportIcon size={14} />
                            )}
                            Import
                          </Button>
                        </div>
                      </TabsContent>
                    )}
                    {activeTab === 'file' && (
                      <TabsContent value="file" forceMount>
                        <div className="grid w-full max-w-sm items-center gap-3 cursor-pointer">
                          <Label htmlFor="picture">CSV/XlS </Label>
                          <Input id="picture" type="file" />
                        </div>
                      </TabsContent>
                    )}
                  </div>
                </div>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-end gap-2">
              <DialogClose>
                <Button
                  variant={'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    setData([]);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              {step === '2' && (
                <Button
                  variant={'destructive'}
                  onClick={() => {
                    setData([]);
                  }}
                  className="cursor-pointer"
                  disabled={data.length === 0}
                >
                  Reset
                </Button>
              )}
              <Button
                className="cursor-pointer"
                onClick={() => {
                  if (step === '1') {
                    setIsConfirmed(true);
                    setStep('2');
                  }
                  if (step === '2' && !isSubmitting) {
                    onSubmit();
                  }
                }}
                disabled={step === '2' && (data.length === 0 || isSubmitting)}
              >
                {isSubmitting ? (
                  <Loader2Icon className="animate-spin mr-2" />
                ) : null}
                {step === '1' && 'Accept'}
                {step === '2' && (isSubmitting ? 'Submitting...' : 'Submit')}
                {step === '3' && 'Complete'}
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
