import DataTableCards from '@/components/cards/datatable-card';
import { ChartBar } from '@/components/cards/chartbar-card';
import { ActivityLogs } from './dashboard-v2-activitylogs';

export default function dashboardviewpage() {
  return (
    <div className='flex flex-col gap-4 p-4 md:p-6'>
      <div className='flex flex-col flex-1'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <DataTableCards />
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-4 min-w-0'>
        {/* Left: Chart */}
        <div className='flex-1 min-w-0'>
          <ChartBar />
        </div>

        {/* Right: Activity Logs card */}
        <div className='w-full lg:flex-1 min-w-0'>
          <ActivityLogs />
        </div>
      </div>
    </div>
  );
}
