import { HistoryTable } from '@/components/dashboard/history-table';

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Blast Message History
          </h1>
          <p className="text-muted-foreground mt-1">
            View the history of your sent blast messages. Track delivery status,
            recipients, and message details all in one place.
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <HistoryTable />
      </div>
    </div>
  );
}
