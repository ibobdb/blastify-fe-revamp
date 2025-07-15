import { HistoryBillingTable } from '@/components/dashboard/history-billing-table';
import { BillingSummary } from '@/components/dashboard/billing-summary';
import { MainPageLayout } from '@/components/dashboard/main-page-layout';

export default function BillingHistoryPage() {
  return (
    <MainPageLayout
      title="Billing History"
      description="View your payment transactions and quota purchases. Track payment status and transaction details."
    >
      <BillingSummary />
      <HistoryBillingTable />
    </MainPageLayout>
  );
}
