'use client';

import { useState, useEffect } from 'react';
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
import {
  User,
  DollarSign,
  CreditCard,
  ChevronDown,
  Check,
  Loader2,
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { useAlert } from '@/hooks/useAlert';
import type { UserListResponse } from '@/types/admin';

type User = UserListResponse['data'][0];

interface QuotaAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Quick amount options
const quickAmounts = [200, 500, 1000, 2500, 5000, 10000];

/**
 * QuotaAddDialog Component
 *
 * A dialog component for administrators to add credits to user accounts.
 *
 * Features:
 * - Fetches real user data from the API with current balance information
 * - Provides quick amount buttons for common credit amounts
 * - Custom amount input for specific credit amounts
 * - Real-time balance preview showing the new balance after credits are added
 * - Loading states for both user fetching and credit addition
 * - Error handling with user-friendly alert messages
 * - Success notifications when credits are added successfully
 *
 * @param open - Whether the dialog is open
 * @param onOpenChange - Callback to handle dialog open/close state
 */
export function QuotaAddDialog({ open, onOpenChange }: QuotaAddDialogProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { showError, showSuccess, AlertComponent } = useAlert();

  const selectedUserData = users.find((user) => user.id === selectedUser);

  // Fetch users when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await adminService.getListUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        showError('Failed to load users', response.message);
      }
    } catch (error) {
      showError('Error', 'Failed to load users. Please try again.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleSubmit = async () => {
    if (!selectedUser || !amount || parseFloat(amount) <= 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await adminService.addQuota({
        userId: selectedUser,
        amount: parseFloat(amount),
      });

      if (response.status) {
        // Show success message
        showSuccess(
          'Credits Added Successfully!',
          `${formatCredits(parseFloat(amount))} credits have been added to ${
            selectedUserData?.name
          }'s account.`
        );

        // Refresh users list to show updated balance
        fetchUsers();

        // Reset form and close dialog
        setSelectedUser('');
        setAmount('');
        onOpenChange(false);
      } else {
        showError('Failed to Add Credits', response.message);
      }
    } catch (error) {
      showError('Error', 'Failed to add credits. Please try again.');
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
    <>
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
                      <span>{selectedUserData.name}</span>
                    ) : (
                      'Choose a user...'
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[460px]">
                  {loadingUsers ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Loading users...
                      </span>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="flex items-center justify-center p-4">
                      <span className="text-sm text-muted-foreground">
                        No users found
                      </span>
                    </div>
                  ) : (
                    users.map((user) => (
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
                      </DropdownMenuItem>
                    ))
                  )}
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
                        amount === quickAmount.toString()
                          ? 'default'
                          : 'outline'
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
                    <span className="text-sm font-medium">Credits to Add:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCredits(parseFloat(amount))}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span>Adding to {selectedUserData.name}'s account</span>
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
      {AlertComponent}
    </>
  );
}
