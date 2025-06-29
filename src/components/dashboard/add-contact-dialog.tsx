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
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
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
            <label htmlFor="number" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
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
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={() => handleCreateContact(false)}
            disabled={
              isLoading || !!numberError || !name.trim() || !number.trim()
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Create
          </button>
          <button
            type="button"
            onClick={() => handleCreateContact(true)}
            disabled={
              isLoading || !!numberError || !name.trim() || !number.trim()
            }
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Create & Add Another
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
