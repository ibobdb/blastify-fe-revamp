'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use AuthGuard for simpler authentication protection
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
