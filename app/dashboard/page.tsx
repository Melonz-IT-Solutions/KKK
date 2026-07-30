import DashboardActivityLogs from '@/components/cards/dashboard-activity-logs'
import DashboardCard from '@/components/cards/dashboard-card'
import DashboardChart from '@/components/cards/dashboard-chart'

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-0">
          <DashboardCard />
          <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-0">
            <DashboardChart />
            <DashboardActivityLogs />
          </div>
        </div>
      </div>
    </div>
  )
}
