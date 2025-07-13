'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
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

const alertVariants = cva(
  'flex items-start gap-4 rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        success:
          'bg-gradient-to-r from-green-50/80 to-emerald-50/80 text-green-900 border-green-200/60 dark:from-green-950/50 dark:to-emerald-950/50 dark:text-green-100 dark:border-green-800/60',
        error:
          'bg-gradient-to-r from-red-50/80 to-rose-50/80 text-red-900 border-red-200/60 dark:from-red-950/50 dark:to-rose-950/50 dark:text-red-100 dark:border-red-800/60',
        warning:
          'bg-gradient-to-r from-amber-50/80 to-yellow-50/80 text-amber-900 border-amber-200/60 dark:from-amber-950/50 dark:to-yellow-950/50 dark:text-amber-100 dark:border-amber-800/60',
        info: 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 text-blue-900 border-blue-200/60 dark:from-blue-950/50 dark:to-cyan-950/50 dark:text-blue-100 dark:border-blue-800/60',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const alertIconVariants = cva('size-5 shrink-0 mt-1', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-amber-600 dark:text-amber-400',
      info: 'text-blue-600 dark:text-blue-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const alertDialogIconVariants = cva('h-6 w-6', {
  variants: {
    variant: {
      default: 'text-gray-500 dark:text-gray-400',
      success: 'text-green-500 dark:text-green-400',
      error: 'text-red-500 dark:text-red-400',
      warning: 'text-yellow-500 dark:text-yellow-400',
      info: 'text-blue-500 dark:text-blue-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  description?: string | React.ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
  showConfirm?: boolean;
  confirmVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
}

const getIcon = (variant: string) => {
  switch (variant) {
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    default:
      return AlertCircle;
  }
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'default',
      title,
      description,
      showIcon = true,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const Icon = getIcon(variant || 'default');

    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon className={cn(alertIconVariants({ variant }))} />
          </div>
        )}
        <div className="flex-1 space-y-2 min-w-0">
          {title && (
            <h3 className="font-semibold text-sm leading-none tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <div className="text-sm leading-relaxed opacity-90">
              {description}
            </div>
          )}
          {children}
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-md p-1 ml-2"
            aria-label="Dismiss alert"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

const ReusableAlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  variant = 'default',
  title,
  description,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = false,
  showConfirm = false,
  confirmVariant = 'default',
}) => {
  const Icon = getIcon(variant);

  // Auto-close timer when no buttons are shown
  React.useEffect(() => {
    if (open && !showConfirm && !showCancel) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, showConfirm, showCancel, onOpenChange]);

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  // Set confirm button variant based on alert type
  const getConfirmVariant = () => {
    if (confirmVariant !== 'default') return confirmVariant;
    switch (variant) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Get background gradient for icon container
  const getIconBg = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-6 py-8">
          <div className={cn('rounded-full p-3', getIconBg())}>
            <Icon className={cn(alertDialogIconVariants({ variant }))} />
          </div>
          <div className="space-y-3 text-center">
            <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </AlertDialogTitle>
            {description && (
              <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                {description}
              </AlertDialogDescription>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            {showCancel && (
              <AlertDialogCancel
                onClick={handleCancel}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              >
                {cancelText}
              </AlertDialogCancel>
            )}
            {showConfirm && (
              <AlertDialogAction
                onClick={handleConfirm}
                className={cn(
                  'w-full sm:w-auto text-white',
                  variant === 'error' &&
                    'bg-red-500 hover:bg-red-600 border-red-500',
                  variant === 'warning' &&
                    'bg-yellow-500 hover:bg-yellow-600 border-yellow-500',
                  variant === 'success' &&
                    'bg-green-500 hover:bg-green-600 border-green-500',
                  variant === 'info' &&
                    'bg-blue-500 hover:bg-blue-600 border-blue-500',
                  variant === 'default' &&
                    'bg-gray-500 hover:bg-gray-600 border-gray-500'
                )}
              >
                {confirmText}
              </AlertDialogAction>
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export {
  Alert,
  ReusableAlertDialog,
  alertVariants,
  type AlertProps,
  type AlertDialogProps,
};
