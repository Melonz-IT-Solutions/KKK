import DataTableCards from '@/components/cards/datatable-card'
import { ChartBar } from '@/components/cards/chartbar-card'
import { ActivityLogs } from './dashboard-v2-activitylogs'

export default function dashboardviewpage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <DataTableCards />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:flex-row">
        {/* Left: Chart */}
        <div className="min-w-0 flex-1">
          <ChartBar />
        </div>

        {/* Right: Activity Logs card */}
        <div className="w-full min-w-0 lg:flex-1">
          <ActivityLogs />
        </div>
      </div>
    </div>
  )
}
