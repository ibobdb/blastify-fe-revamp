# Alert System Documentation

A comprehensive, reusable alert system for the application with both inline alerts and modal dialogs.

## Overview

The alert system consists of:

- **Alert Component**: Inline alerts for immediate feedback
- **ReusableAlertDialog**: Modal dialogs for important notifications
- **useAlert Hook**: Local alert management within components
- **AlertProvider & useGlobalAlert**: Global alert system across the entire app

## Components

### 1. Alert Component (Inline)

```tsx
import { Alert } from '@/components/alert';

<Alert
  variant="success" // 'success' | 'error' | 'warning' | 'info' | 'default'
  title="Success!"
  description="Your action was completed successfully."
  dismissible={true}
  onDismiss={() => console.log('Alert dismissed')}
/>;
```

**Props:**

- `variant`: Alert type styling
- `title`: Main alert heading
- `description`: Optional description text or ReactNode
- `showIcon`: Show/hide variant icon (default: true)
- `dismissible`: Show close button (default: false)
- `onDismiss`: Callback when alert is dismissed
- `children`: Custom content within the alert

### 2. ReusableAlertDialog Component (Modal)

```tsx
import { ReusableAlertDialog } from '@/components/alert';

<ReusableAlertDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  variant="warning"
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  confirmText="Proceed"
  cancelText="Cancel"
  showCancel={true}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>;
```

## Hooks

### 1. useAlert Hook (Local)

Use this hook within individual components for local alert management:

```tsx
import { useAlert } from '@/hooks';

const MyComponent = () => {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    AlertComponent,
  } = useAlert();

  const handleAction = async () => {
    try {
      await performAction();
      showSuccess('Success!', 'Action completed successfully');
    } catch (error) {
      showError('Error!', 'Something went wrong');
    }
  };

  const handleDelete = () => {
    showConfirm('Delete Item', 'This action cannot be undone', async () => {
      await deleteItem();
      showSuccess('Deleted!', 'Item removed successfully');
    });
  };

  return (
    <div>
      {/* Your component content */}
      <button onClick={handleAction}>Perform Action</button>
      <button onClick={handleDelete}>Delete Item</button>

      {/* Required: Render the AlertComponent */}
      {AlertComponent}
    </div>
  );
};
```

### 2. useGlobalAlert Hook (Global)

Use this hook anywhere in your app for global alert management (requires AlertProvider):

```tsx
import { useGlobalAlert } from '@/context';

const AnyComponent = () => {
  const { showSuccess, showError, showConfirm } = useGlobalAlert();

  const handleAction = () => {
    showSuccess('Global Success!', 'This alert works from anywhere');
  };

  return <button onClick={handleAction}>Show Global Alert</button>;
};
```

## Setup for Global Usage

### 1. Wrap your app with AlertProvider

In your root layout or app component:

```tsx
import { AlertProvider } from '@/context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>{children}</AlertProvider>
      </body>
    </html>
  );
}
```

### 2. Use alerts anywhere in your app

After wrapping with AlertProvider, you can use alerts in any component:

```tsx
import { useGlobalAlert } from '@/context';

const Header = () => {
  const { showInfo } = useGlobalAlert();

  return (
    <header>
      <button onClick={() => showInfo('Info', 'Welcome to the app!')}>
        Show Welcome Message
      </button>
    </header>
  );
};

const LoginForm = () => {
  const { showSuccess, showError } = useGlobalAlert();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      showSuccess('Welcome!', 'You have successfully logged in');
    } catch (error) {
      showError('Login Failed', 'Invalid credentials');
    }
  };

  // ... rest of component
};
```

## Available Methods

### Alert Methods

All hooks (`useAlert` and `useGlobalAlert`) provide these methods:

```tsx
// Basic alerts
showSuccess(title: string, description?: string)
showError(title: string, description?: string)
showWarning(title: string, description?: string)
showInfo(title: string, description?: string)

// Confirmation dialog
showConfirm(
  title: string,
  description?: string,
  onConfirm?: () => void | Promise<void>
)

// Advanced alert
showAlert({
  variant: 'success' | 'error' | 'warning' | 'info' | 'default',
  title: string,
  description?: string,
  confirmText?: string,
  cancelText?: string,
  onConfirm?: () => void | Promise<void>,
  onCancel?: () => void,
  showCancel?: boolean,
  confirmVariant?: ButtonVariant
})

// Hide current alert
hideAlert()
```

## Styling Variants

The alert system supports 5 variants with consistent theming:

- **success**: Green theme for positive actions
- **error**: Red theme for errors and failures
- **warning**: Yellow theme for warnings and confirmations
- **info**: Blue theme for informational messages
- **default**: Standard theme for general alerts

## Best Practices

1. **Use Global Alerts for App-Wide Notifications**

   ```tsx
   // ✅ Good - for navigation, authentication, global actions
   const { showSuccess } = useGlobalAlert();
   showSuccess('Profile Updated', 'Your changes have been saved');
   ```

2. **Use Local Alerts for Component-Specific Feedback**

   ```tsx
   // ✅ Good - for form validation, component actions
   const { showError, AlertComponent } = useAlert();
   showError('Invalid Input', 'Please check the form fields');
   return (
     <div>
       {/* form */}
       {AlertComponent}
     </div>
   );
   ```

3. **Use Confirm Dialogs for Destructive Actions**

   ```tsx
   // ✅ Good - for delete, logout, data loss actions
   showConfirm(
     'Delete Account',
     'This action cannot be undone',
     async () => await deleteAccount()
   );
   ```

4. **Provide Meaningful Messages**

   ```tsx
   // ❌ Bad
   showError('Error', 'Something went wrong');

   // ✅ Good
   showError(
     'Upload Failed',
     'File size exceeds 10MB limit. Please choose a smaller file.'
   );
   ```

## Examples

See `/src/components/alert-examples.tsx` for comprehensive usage examples and demos.

## Type Safety

All components and hooks are fully typed with TypeScript. Import types when needed:

```tsx
import type { AlertProps, AlertDialogProps } from '@/components/alert';
```
