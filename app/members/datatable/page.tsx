import DataTableCards from '@/components/cards/datatable-card'
import ActiveLogTable from '@/components/activelog/recentmember-table'
import { activeLogs } from '@/lib/data/activelog'
import DepartmentLoadCard from '@/components/cards/departmentload-card'
import Button from '@/components/button'

import { Calendar, Download } from 'lucide-react'

const page = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-semibold">Workspace OverView</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back,super Admin. Here is what is happening across KKK Workspace today.
          </p>
        </div>
        <div className="flex gap-4 whitespace-break-spaces">
          <Button className="bg-color-white border-black text-black">
            <Calendar />
            Last 30 days
          </Button>
          <Button>
            <Download />
            Export Report
          </Button>
        </div>
      </div>

      <div className="@container/main">
        <div className="">
          <DataTableCards />
        </div>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-[1200px_1fr]">
        {/* Left: Table */}
        <div className="w-full min-w-0 lg:flex-1">
          <ActiveLogTable data={activeLogs} />
        </div>

        {/* Right: Card */}
        <div className="grid md:grid-cols-[300px_1fr]">
          <DepartmentLoadCard />
        </div>
      </div>
    </div>
  )
}

export default page
