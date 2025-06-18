'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrap in ProtectedRoute for client-side protection in addition to middleware
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
