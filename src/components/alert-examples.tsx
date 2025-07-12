// Example usage of the Alert components

import React from 'react';
import { Alert, ReusableAlertDialog } from '@/components/alert';
import { useAlert } from '@/hooks';
import { useGlobalAlert } from '@/context';
import { Button } from '@/components/ui/button';

export function AlertExamples() {
  // Local alert hook - requires AlertComponent to be rendered
  const {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    AlertComponent,
  } = useAlert();

  // Global alert hook - works anywhere if AlertProvider is set up
  // Comment out this line if AlertProvider is not set up in your app
  // const globalAlert = useGlobalAlert();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [currentVariant, setCurrentVariant] = React.useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Alert Component Examples</h2>

      {/* Inline Alerts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Inline Alerts</h3>

        <Alert
          variant="success"
          title="Success Alert"
          description="This is a success message. Everything went well!"
          dismissible
          onDismiss={() => console.log('Success alert dismissed')}
        />

        <Alert
          variant="error"
          title="Error Alert"
          description="This is an error message. Something went wrong!"
          dismissible
          onDismiss={() => console.log('Error alert dismissed')}
        />

        <Alert
          variant="warning"
          title="Warning Alert"
          description="This is a warning message. Please be careful!"
          dismissible
          onDismiss={() => console.log('Warning alert dismissed')}
        />

        <Alert
          variant="info"
          title="Info Alert"
          description="This is an info message. Here's some useful information!"
          dismissible
          onDismiss={() => console.log('Info alert dismissed')}
        />

        <Alert
          variant="default"
          title="Default Alert"
          description="This is a default alert without specific styling."
          showIcon={false}
        />
      </div>

      {/* Alert Dialogs via useAlert hook */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Alert Dialogs (using useAlert hook)
        </h3>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            onClick={() =>
              showSuccess('Success!', 'Your action was completed successfully.')
            }
          >
            Show Success Dialog
          </Button>

          <Button
            variant="destructive"
            onClick={() =>
              showError('Error!', 'Something went wrong. Please try again.')
            }
          >
            Show Error Dialog
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              showWarning('Warning!', 'This action may have consequences.')
            }
          >
            Show Warning Dialog
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              showInfo(
                'Information',
                'Here is some important information for you.'
              )
            }
          >
            Show Info Dialog
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              showConfirm(
                'Confirm Action',
                'Are you sure you want to proceed? This action cannot be undone.',
                async () => {
                  // Simulate async operation
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  showSuccess('Confirmed!', 'Your action has been confirmed.');
                }
              )
            }
          >
            Show Confirm Dialog
          </Button>
        </div>
      </div>

      {/* Manual Alert Dialog */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Manual Alert Dialog</h3>

        <div className="flex flex-wrap gap-2">
          {(['success', 'error', 'warning', 'info'] as const).map((variant) => (
            <Button
              key={variant}
              variant="outline"
              onClick={() => {
                setCurrentVariant(variant);
                setDialogOpen(true);
              }}
              className="capitalize"
            >
              Show {variant} Dialog
            </Button>
          ))}
        </div>

        <ReusableAlertDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          variant={currentVariant}
          title={`${
            currentVariant.charAt(0).toUpperCase() + currentVariant.slice(1)
          } Dialog`}
          description={`This is a ${currentVariant} dialog with custom content.`}
          confirmText="Got it"
          showCancel={currentVariant === 'warning'}
          onConfirm={() => console.log(`${currentVariant} confirmed`)}
          onCancel={() => console.log(`${currentVariant} cancelled`)}
        />
      </div>

      {/* Custom Alert with children */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Alert with Children</h3>

        <Alert variant="info" title="Custom Content Alert">
          <div className="mt-2 space-y-2">
            <p className="text-sm">You can add custom content inside alerts:</p>
            <ul className="text-sm list-disc list-inside space-y-1">
              <li>Custom lists</li>
              <li>Additional buttons</li>
              <li>Links and other elements</li>
            </ul>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline">
                Learn More
              </Button>
              <Button size="sm">Take Action</Button>
            </div>
          </div>
        </Alert>
      </div>

      {/* Global Alert Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Global Alert System</h3>
        <p className="text-sm text-muted-foreground">
          To use global alerts, wrap your app with AlertProvider and uncomment
          the useGlobalAlert hook above.
        </p>

        <div className="p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium mb-2">Setup Required:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Wrap your app with &lt;AlertProvider&gt;</li>
            <li>Use useGlobalAlert() in any component</li>
            <li>No need to render AlertComponent manually</li>
          </ol>
        </div>

        {/* Uncomment this section when AlertProvider is set up */}
        {/*
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => globalAlert.showSuccess('Global Success!', 'This works from anywhere in the app')}
          >
            Global Success
          </Button>
          <Button 
            variant="destructive"
            onClick={() => globalAlert.showError('Global Error!', 'This error appears globally')}
          >
            Global Error
          </Button>
          <Button 
            variant="outline"
            onClick={() => globalAlert.showConfirm(
              'Global Confirm', 
              'This confirmation works globally',
              () => globalAlert.showInfo('Confirmed!', 'Global confirmation completed')
            )}
          >
            Global Confirm
          </Button>
        </div>
        */}
      </div>

      {/* Render the alert component from useAlert hook */}
      {AlertComponent}
    </div>
  );
}
