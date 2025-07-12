// Example of how to integrate AlertProvider into your app layout

import React from 'react';
import { AlertProvider } from '@/context';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Example layout component showing how to integrate the AlertProvider
 * This makes alert functionality available throughout the entire app
 */
export const AppLayoutExample: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <AlertProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">My App</h1>
            {/* Header components can now use useGlobalAlert */}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {children}
          {/* All child components can now use useGlobalAlert */}
        </main>

        <footer className="border-t mt-auto">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-muted-foreground">
              © 2024 My App. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      {/* AlertComponent is automatically rendered by AlertProvider */}
    </AlertProvider>
  );
};

// Example usage in Next.js app/layout.tsx
/*
import { AlertProvider } from '@/context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlertProvider>
          {children}
        </AlertProvider>
      </body>
    </html>
  );
}
*/

// Example usage in any component after AlertProvider is set up
/*
import { useGlobalAlert } from '@/context';

const MyComponent = () => {
  const { showSuccess, showError, showConfirm } = useGlobalAlert();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Saved!', 'Your changes have been saved successfully');
    } catch (error) {
      showError('Save Failed', 'Unable to save your changes. Please try again.');
    }
  };

  const handleDelete = () => {
    showConfirm(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      async () => {
        await deleteItem();
        showSuccess('Deleted!', 'Item has been successfully deleted');
      }
    );
  };

  return (
    <div>
      <button onClick={handleSave}>Save Changes</button>
      <button onClick={handleDelete}>Delete Item</button>
    </div>
  );
};
*/
