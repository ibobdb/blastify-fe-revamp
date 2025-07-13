import { useState } from 'react';
import { PlusIcon, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    contact: { name: string; number: string },
    createAnother: boolean
  ) => void;
}

export default function AddContactDialog({
  isOpen,
  onClose,
  onSubmit,
}: AddContactDialogProps) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [numberError, setNumberError] = useState('');

  const resetForm = () => {
    setName('');
    setNumber('');
  };

  const validateNumber = (value: string) => {
    const trimmed = value.trim();
    if (!/^((08)|(62))\d{9,11}$/.test(trimmed)) {
      if (!/^((08)|(62))/.test(trimmed)) {
        return 'Number must start with 08 or 62';
      }
      if (trimmed.length < 11) {
        return 'Number must be at least 11 digits';
      }
      if (trimmed.length > 13) {
        return 'Number must be at most 13 digits';
      }
      return 'Invalid number format';
    }
    return '';
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only allow numbers, but keep the prefix if user types 08 or 62
    if (/^0|^6/.test(value)) {
      value = value.replace(/[^0-9]/g, '');
    } else {
      value = value.replace(/\D/g, '');
    }
    setNumber(value);
    setNumberError(validateNumber(value));
  };

  const handleCreateContact = (createAnother: boolean) => {
    if (name.trim() && number.trim() && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        onSubmit({ name, number }, createAnother);
        resetForm();
        if (!createAnother) {
          onClose();
        }
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </Label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="Enter contact name"
            />
          </div>
          <div>
            <Label htmlFor="number" className="block text-sm font-medium mb-1">
              Phone Number
            </Label>
            <input
              id="number"
              type="text"
              value={number}
              onChange={handleNumberChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="Format: 08xx or 62xx, 11-13 digits"
            />
            {numberError && (
              <div className="text-xs text-red-500 mt-1">{numberError}</div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => handleCreateContact(false)}
            disabled={
              isLoading || !!numberError || !name.trim() || !number.trim()
            }
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Create
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleCreateContact(true)}
            disabled={
              isLoading || !!numberError || !name.trim() || !number.trim()
            }
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Create & Add Another
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
