'use client';

import { useState } from 'react';
import { ApiKeyTable } from '@/components/dashboard/api-key-table';
import { CreateApiKeyDialog } from '@/components/dashboard/create-api-key-dialog';
import { MainPageLayout } from '@/components/dashboard/main-page-layout';
export default function ApiManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <MainPageLayout
      title="API Management"
      description="Manage your API keys, monitor usage, and control access to your application. Create, revoke, and regenerate keys as needed."
    >
      <ApiKeyTable
        onCreateNew={() => setCreateDialogOpen(true)}
        refreshTrigger={refreshTrigger}
      />

      <CreateApiKeyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </MainPageLayout>
  );
}
