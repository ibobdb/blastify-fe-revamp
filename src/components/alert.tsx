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

const alertDialogIconVariants = cva('size-16 mx-auto mb-6 drop-shadow-sm', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      success: 'text-green-500 dark:text-green-400',
      error: 'text-red-500 dark:text-red-400',
      warning: 'text-amber-500 dark:text-amber-400',
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
  confirmVariant = 'default',
}) => {
  const Icon = getIcon(variant);

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
        return 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30';
      case 'error':
        return 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30';
      case 'warning':
        return 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30';
      case 'info':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md overflow-hidden border-0 bg-background/95 backdrop-blur-xl shadow-2xl">
        <AlertDialogHeader className="text-center space-y-6 pt-6">
          <div
            className={cn(
              'w-24 h-24 mx-auto rounded-full flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10',
              getIconBg()
            )}
          >
            <Icon className={cn(alertDialogIconVariants({ variant }))} />
          </div>
          <div className="space-y-3">
            <AlertDialogTitle className="text-2xl font-bold tracking-tight leading-tight">
              {title}
            </AlertDialogTitle>
            {description && (
              <AlertDialogDescription className="text-base leading-relaxed text-muted-foreground/80 max-w-sm mx-auto">
                {description}
              </AlertDialogDescription>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-3 pt-8 pb-6">
          {showCancel && (
            <AlertDialogCancel
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-2.5 font-medium transition-all hover:bg-muted/80"
            >
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(
              'w-full sm:w-auto px-6 py-2.5 font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]',
              variant === 'error' &&
                'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0',
              variant === 'warning' &&
                'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0',
              variant === 'success' &&
                'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0',
              variant === 'info' &&
                'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0',
              variant === 'default' &&
                'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground border-0'
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
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
