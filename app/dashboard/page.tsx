import DashboardCard from '@/components/cards/dashboard-card'
import Recentmember from '@/components/activelog/recentmember-table'
import { activeLogs } from '@/lib/data/activelog'
import DepartmentLoadCard from '@/components/cards/departmentload-card'

export default function DashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Top Cards */}
      <DashboardCard />

      {/* Bottom Section */}
      <div className="">
        <div className="min-w-0 lg:col-span-3">
          <Recentmember data={activeLogs} />
        </div>

        <div className="min-w-0 lg:col-span-2">
          <DepartmentLoadCard />
        </div>
      </div>
    </div>
  )
}
