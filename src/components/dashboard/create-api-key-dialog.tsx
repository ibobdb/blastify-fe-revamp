'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiManagementService } from '@/services/api-management.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Schema for form validation
const createApiKeySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'Name can only contain letters, numbers, spaces, hyphens, and underscores'
    ),
  expiresAt: z.date().optional(),
});

type CreateApiKeyFormValues = z.infer<typeof createApiKeySchema>;

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CreatedApiKey {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateApiKeyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState<CreatedApiKey | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const form = useForm<CreateApiKeyFormValues>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
      expiresAt: undefined,
    },
  });

  const handleCopyApiKey = async () => {
    if (!createdApiKey) return;

    try {
      await navigator.clipboard.writeText(createdApiKey.key);
      setCopied(true);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy API key');
    }
  };

  const onSubmit = async (values: CreateApiKeyFormValues) => {
    setIsLoading(true);
    try {
      const payload: any = {
        name: values.name.trim(),
      };

      if (values.expiresAt) {
        payload.expiresAt = values.expiresAt.toISOString();
      }

      const response = await apiManagementService.createApiKey(payload);

      if (response.status) {
        setCreatedApiKey(response.data);
        toast.success('API key created successfully');
        form.reset();
      } else {
        toast.error(response.message || 'Failed to create API key');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (createdApiKey) {
      onSuccess();
      setCreatedApiKey(null);
    }
    onOpenChange(false);
    form.reset();
    setCopied(false);
  };

  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleClose();
    } else {
      onOpenChange(newOpen);
    }
  };

  // If API key was just created, show the success view
  if (createdApiKey) {
    return (
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              API Key Created Successfully
            </DialogTitle>
            <DialogDescription>
              Your API key has been created. Make sure to copy it now as you
              won't be able to see it again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                {createdApiKey.name}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">API Key</label>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {createdApiKey.key}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyApiKey}
                  className={cn(
                    'shrink-0',
                    copied && 'bg-green-50 border-green-200 text-green-600'
                  )}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {createdApiKey.expiresAt && (
              <div>
                <label className="text-sm font-medium">Expires At</label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  {format(new Date(createdApiKey.expiresAt), 'PPP')}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Normal create form view
  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New API Key</DialogTitle>
          <DialogDescription>
            Create a new API key to access the Blastify API. You can optionally
            set an expiration date.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Production API Key"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name to help you identify this API key
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiration Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick an expiration date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Leave empty if you don't want the key to expire
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create API Key'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
