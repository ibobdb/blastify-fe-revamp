import { HistoryBillingTable } from '@/components/dashboard/history-billing-table';
import { BillingSummary } from '@/components/dashboard/billing-summary';

export default function BillingHistoryPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing History</h1>
          <p className="text-muted-foreground mt-1">
            View your payment transactions and quota purchases. Track payment
            status and transaction details.
          </p>
        </div>
      </div>

      {/* Summary cards outside the white container */}
      <div className="mb-6">
        <BillingSummary />
      </div>

      {/* Data table inside the white container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <HistoryBillingTable />
      </div>
    </div>
  );
}
