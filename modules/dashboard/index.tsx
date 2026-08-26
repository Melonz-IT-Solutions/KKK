import DataTableCards from '@/components/cards/datatable-card'

import { ActivityLogs } from './components/activitylogs'
import { ChartBar } from '@/modules/dashboard/components/chartbar'
import { getMembersChartData } from '@/lib/services/dashboard.service'

export default async function Dashboardv2ViewPage() {
  const chartData = await getMembersChartData()

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <DataTableCards />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1">
          <ChartBar data={chartData} />
        </div>

        <div className="w-full min-w-0 lg:flex-1">
          <ActivityLogs />
        </div>
      </div>
    </div>
  )
}
