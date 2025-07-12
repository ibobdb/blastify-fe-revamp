'use client';

import React, { useState } from 'react';
import { Alert, ReusableAlertDialog } from '@/components/alert';
import { Button } from '@/components/ui/button';

export default function ImprovedAlertExamples() {
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [warningDialog, setWarningDialog] = useState(false);
  const [infoDialog, setInfoDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Improved Alert Components</h1>
        <p className="text-muted-foreground">
          Enhanced alert dialogs with better visual design and user experience.
        </p>
      </div>

      {/* Alert Banners */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Alert Banners</h2>
        <div className="grid gap-4">
          <Alert
            variant="success"
            title="Success!"
            description="Your account has been created successfully. Welcome to our platform!"
            dismissible
          />
          <Alert
            variant="error"
            title="Error occurred"
            description="There was a problem processing your request. Please try again."
            dismissible
          />
          <Alert
            variant="warning"
            title="Warning"
            description="Your storage is almost full. Consider upgrading your plan."
            dismissible
          />
          <Alert
            variant="info"
            title="Information"
            description="We've updated our privacy policy. Please review the changes."
            dismissible
          />
        </div>
      </section>

      {/* Dialog Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Alert Dialogs</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setSuccessDialog(true)} variant="outline">
            Success Dialog
          </Button>
          <Button onClick={() => setErrorDialog(true)} variant="outline">
            Error Dialog
          </Button>
          <Button onClick={() => setWarningDialog(true)} variant="outline">
            Warning Dialog
          </Button>
          <Button onClick={() => setInfoDialog(true)} variant="outline">
            Info Dialog
          </Button>
          <Button onClick={() => setConfirmDialog(true)} variant="outline">
            Confirmation Dialog
          </Button>
        </div>
      </section>

      {/* Dialog Components */}
      <ReusableAlertDialog
        open={successDialog}
        onOpenChange={setSuccessDialog}
        variant="success"
        title="Payment Successful!"
        description="Your payment has been processed successfully. You should receive a confirmation email shortly."
        confirmText="Continue"
      />

      <ReusableAlertDialog
        open={errorDialog}
        onOpenChange={setErrorDialog}
        variant="error"
        title="Delete Account"
        description="This action cannot be undone. This will permanently delete your account and remove all your data from our servers."
        confirmText="Delete Account"
        cancelText="Cancel"
        showCancel
      />

      <ReusableAlertDialog
        open={warningDialog}
        onOpenChange={setWarningDialog}
        variant="warning"
        title="Unsaved Changes"
        description="You have unsaved changes that will be lost if you continue. Are you sure you want to leave this page?"
        confirmText="Leave Page"
        cancelText="Stay"
        showCancel
      />

      <ReusableAlertDialog
        open={infoDialog}
        onOpenChange={setInfoDialog}
        variant="info"
        title="System Maintenance"
        description="We'll be performing scheduled maintenance on Sunday, July 14th from 2:00 AM to 4:00 AM UTC. Some features may be temporarily unavailable."
        confirmText="Got it"
      />

      <ReusableAlertDialog
        open={confirmDialog}
        onOpenChange={setConfirmDialog}
        variant="default"
        title="Confirm Action"
        description="Are you sure you want to proceed with this action? This will update your preferences and notify all team members."
        confirmText="Confirm"
        cancelText="Cancel"
        showCancel
        onConfirm={async () => {
          // Simulate async operation
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log('Action confirmed!');
        }}
      />
    </div>
  );
}
