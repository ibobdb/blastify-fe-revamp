'use client';

import React from 'react';
import { useConfirm } from '@/context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trash, AlertTriangle, InfoIcon } from 'lucide-react';

export default function ConfirmDialogDemo() {
  const { confirm, confirmInfo, confirmWarning, confirmDanger } = useConfirm();

  const handleCustomConfirm = async () => {
    const result = await confirm({
      title: 'Custom Confirmation',
      description:
        'This is a fully customizable confirmation dialog. You can specify any options you need.',
      type: 'warning',
      confirmText: 'I Understand',
      cancelText: 'Not Now',
    });

    if (result) {
      console.log('User confirmed the custom dialog');
    } else {
      console.log('User cancelled the custom dialog');
    }
  };

  const handleInfoConfirm = async () => {
    const confirmed = await confirmInfo(
      'Information',
      'This is an informational message that requires acknowledgment.',
      'Got it'
    );

    if (confirmed) {
      console.log('User acknowledged the information');
    }
  };

  const handleWarningConfirm = async () => {
    const confirmed = await confirmWarning(
      'Proceed with caution',
      'This action may have consequences. Are you sure you want to continue?',
      'Proceed'
    );

    if (confirmed) {
      console.log('User confirmed the warning');
    } else {
      console.log('User cancelled the warning');
    }
  };

  const handleDangerConfirm = async () => {
    const confirmed = await confirmDanger(
      'Delete item?',
      'This action cannot be undone. This will permanently delete this item and remove all associated data.',
      'Delete'
    );

    if (confirmed) {
      console.log('User confirmed deletion');
      // Perform the deletion here
    } else {
      console.log('User cancelled deletion');
    }
  };

  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold">Confirmation Dialog Examples</h1>
      <p className="text-muted-foreground">
        These examples show the different types of confirmation dialogs
        available.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="text-primary h-5 w-5" />
              Information Dialog
            </CardTitle>
            <CardDescription>
              Use for simple notifications that require acknowledgment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The info confirmation uses blue styling and is ideal for messages
              that just need to be acknowledged.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleInfoConfirm}>Show Info Dialog</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500 h-5 w-5" />
              Warning Dialog
            </CardTitle>
            <CardDescription>
              Use for actions that need careful consideration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The warning confirmation uses amber/yellow styling and is ideal
              for actions that need attention but aren't destructive.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" onClick={handleWarningConfirm}>
              Show Warning Dialog
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash className="text-destructive h-5 w-5" />
              Danger Dialog
            </CardTitle>
            <CardDescription>
              Use for dangerous or destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The danger confirmation uses red styling and is ideal for
              destructive actions like deleting data.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleDangerConfirm}>
              Show Danger Dialog
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Dialog</CardTitle>
            <CardDescription>Full control over dialog options</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You can customize every aspect of the dialog including title,
              description, buttons text, and behavior.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleCustomConfirm}>
              Show Custom Dialog
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
