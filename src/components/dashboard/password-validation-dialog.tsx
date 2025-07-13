'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import { toast } from 'sonner';

interface PasswordValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidated: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
}

export function PasswordValidationDialog({
  open,
  onOpenChange,
  onValidated,
  title = 'Confirm Password',
  description = 'Please enter your password to confirm this sensitive action.',
  actionLabel = 'Confirm',
}: PasswordValidationDialogProps) {
  const { validatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    if (!password.trim()) {
      toast.error('Password is required');
      return;
    }

    setIsValidating(true);
    try {
      await validatePassword(password);
      toast.success('Password validated successfully');
      onValidated();
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Invalid password');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    setIsValidating(false);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isValidating) {
      handleValidate();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                disabled={isValidating}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isValidating}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isValidating}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleValidate}
            disabled={isValidating || !password.trim()}
          >
            {isValidating ? 'Validating...' : actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
