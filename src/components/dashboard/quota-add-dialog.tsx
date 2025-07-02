'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, DollarSign, CreditCard, ChevronDown, Check } from 'lucide-react';

interface QuotaAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Dummy users data
const dummyUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', currentBalance: 150 },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    currentBalance: 75,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    currentBalance: 320,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    currentBalance: 0,
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    currentBalance: 250,
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily@example.com',
    currentBalance: 45,
  },
];

// Quick amount options
const quickAmounts = [200, 500, 1000, 2500, 5000, 10000];

export function QuotaAddDialog({ open, onOpenChange }: QuotaAddDialogProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const selectedUserData = dummyUsers.find((user) => user.id === selectedUser);

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleSubmit = async () => {
    if (!selectedUser || !amount || parseFloat(amount) <= 0) {
      return;
    }

    setLoading(true);

    // Simulate API call
    try {
      console.log('Adding quota:', {
        userId: selectedUser,
        amount: parseFloat(amount),
        user: selectedUserData,
      });

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form and close dialog
      setSelectedUser('');
      setAmount('');
      onOpenChange(false);

      // TODO: Show success message
      console.log('Quota added successfully!');
    } catch (error) {
      console.error('Error adding quota:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCredits = (amount: number) => {
    return amount.toLocaleString();
  };

  const isValidAmount = amount && parseFloat(amount) > 0;
  const canSubmit = selectedUser && isValidAmount && !loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Add Credits</span>
          </DialogTitle>
          <DialogDescription>
            Add credits to a user's account. Select a user and specify the
            amount to add.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Select User</span>
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedUserData ? (
                    <div className="flex items-center justify-between w-full">
                      <span>{selectedUserData.name}</span>
                      <Badge
                        variant={
                          selectedUserData.currentBalance > 0
                            ? 'success'
                            : 'destructive'
                        }
                        className="text-xs"
                      >
                        {formatCredits(selectedUserData.currentBalance)}
                      </Badge>
                    </div>
                  ) : (
                    'Choose a user...'
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[460px]">
                {dummyUsers.map((user) => (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex flex-col items-start flex-1">
                      <div className="flex items-center space-x-2">
                        {selectedUser === user.id && (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                    <Badge
                      variant={
                        user.currentBalance > 0 ? 'success' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {formatCredits(user.currentBalance)}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Selected User Info */}
            {selectedUserData && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedUserData.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedUserData.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Current Balance
                    </p>
                    <p className="font-semibold">
                      {formatCredits(selectedUserData.currentBalance)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Amount Selection */}
          <div className="space-y-4">
            <Label className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Credits to Add</span>
            </Label>

            {/* Quick Amount Buttons */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Quick amounts:</p>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant={
                      amount === quickAmount.toString() ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className="h-8"
                  >
                    {formatCredits(quickAmount)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount-input" className="text-sm">
                Or enter custom amount:
              </Label>
              <Input
                id="amount-input"
                type="number"
                placeholder="Enter credits amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="1"
              />
            </div>

            {/* Amount Preview */}
            {selectedUserData && isValidAmount && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New Balance:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCredits(
                      selectedUserData.currentBalance + parseFloat(amount)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    Current: {formatCredits(selectedUserData.currentBalance)}
                  </span>
                  <span>+ {formatCredits(parseFloat(amount))}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="min-w-[100px]"
          >
            {loading ? 'Adding...' : 'Add Credits'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
