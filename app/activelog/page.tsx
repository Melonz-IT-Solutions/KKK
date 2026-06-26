import ActiveLogTable from '@/components/activelog/activelog-table'
import { activeLogs } from '@/lib/data/activelog'

export default function ActiveLogPage() {
  return (
    <div className="grid space-y-6 md:grid-cols-[1000px_1fr]">
      <div className="p-6">
        <ActiveLogTable data={activeLogs} />
      </div>
    </div>
  )
}
