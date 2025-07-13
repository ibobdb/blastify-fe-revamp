'use client';

import { useState } from 'react';
import { ApiKeyTable } from '@/components/dashboard/api-key-table';
import { CreateApiKeyDialog } from '@/components/dashboard/create-api-key-dialog';

export default function ApiManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <ApiKeyTable
        onCreateNew={() => setCreateDialogOpen(true)}
        refreshTrigger={refreshTrigger}
      />

      <CreateApiKeyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
