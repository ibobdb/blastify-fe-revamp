import { ScheduleTable } from '@/components/dashboard/schedule-table';
import { MainPageLayout } from '@/components/dashboard/main-page-layout';
export default function SchedulerPage() {
  return (
    <MainPageLayout
      title="Scheduler"
      description="Effortlessly schedule and send messages to multiple contacts or
            groups. Automate your communication to save time and ensure your
            messages reach the right audience at the perfect moment."
    >
      <ScheduleTable />
    </MainPageLayout>
  );
}
