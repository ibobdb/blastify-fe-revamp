'use client';

import { useState } from 'react';
import { PasswordValidationDialog } from '@/components/dashboard/password-validation-dialog';
import { Button } from '@/components/ui/button';

export default function PasswordValidationTest() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleValidated = () => {
    console.log('Password validated successfully!');
    // You can add any action here that should happen after password validation
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Password Validation Test</h1>
      <p className="text-muted-foreground">
        This is a test page for the password validation dialog.
      </p>

      <Button onClick={() => setDialogOpen(true)}>
        Test Password Validation
      </Button>

      <PasswordValidationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onValidated={handleValidated}
        title="Test Password Validation"
        description="Enter your password to test the validation functionality."
        actionLabel="Validate"
      />
    </div>
  );
}
