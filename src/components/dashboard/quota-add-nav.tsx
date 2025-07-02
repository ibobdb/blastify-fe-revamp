'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import { QuotaAddDialog } from './quota-add-dialog';

export function QuotaAddNav() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only show for users with "suhu" role
  if (!user || user.role !== 'suhu') {
    return null;
  }

  const handleAddQuota = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Add Credits"
        onClick={handleAddQuota}
        title="Add Credits"
      >
        <CreditCard className="h-5 w-5" />
      </Button>

      <QuotaAddDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
