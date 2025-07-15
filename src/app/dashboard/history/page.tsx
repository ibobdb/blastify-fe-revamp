import { HistoryTable } from '@/components/dashboard/history-table';
import { HistorySummary } from '@/components/dashboard/history-summary';
import { MainPageLayout } from '@/components/dashboard/main-page-layout';
export default function HistoryPage() {
  return (
    <MainPageLayout
      title="Blast Message History"
      description="View the history of your sent blast messages. Track delivery status, recipients, and message details all in one place."
    >
      <HistorySummary />
      <HistoryTable />
    </MainPageLayout>
  );
}
