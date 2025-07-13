import { ScheduleTable } from '@/components/dashboard/schedule-table';
export default function SchedulerPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduler</h1>
          <p className="text-muted-foreground mt-1">
            Effortlessly schedule and send messages to multiple contacts or
            groups. Automate your communication to save time and ensure your
            messages reach the right audience at the perfect moment.
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <ScheduleTable />
      </div>
    </div>
  );
}
