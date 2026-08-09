'use client'

import { useState } from 'react'
import { LayoutList, Table2 } from 'lucide-react'
import TableView from '@/components/activity-logs/table-view'
import TimelineView from '@/components/activity-logs/timeline-view'
import type { ActivityLog } from '@/components/activity-logs/table-view'

const activityLogs: ActivityLog[] = [
  {
    id: 1,
    date: 'July 17, 2026',
    title: 'Member Update',
    description: 'Khadeer Kala updated the email to khadeer1@gmail.com',
    updatedBy: 'Super Admin',
    type: 'update',
  },
  {
    id: 2,
    date: 'July 17, 2026',
    title: 'Member Added',
    description: 'John Doe was added as a new member to the organization',
    updatedBy: 'Super Admin',
    type: 'create',
  },
  {
    id: 3,
    date: 'July 16, 2026',
    title: 'Member Removed',
    description: 'Jane Smith was removed from the system',
    updatedBy: 'Admin',
    type: 'delete',
  },
  {
    id: 4,
    date: 'July 16, 2026',
    title: 'Role Changed',
    description: "Michael Brown's role was changed to Branch Manager",
    updatedBy: 'Super Admin',
    type: 'role',
  },
  {
    id: 5,
    date: 'July 15, 2026',
    title: 'Staff Account Created',
    description: 'Sarah Connor was added as a new staff member',
    updatedBy: 'Super Admin',
    type: 'create',
  },
  {
    id: 6,
    date: 'July 15, 2026',
    title: 'Settings Updated',
    description: 'Organization profile settings were updated',
    updatedBy: 'Super Admin',
    type: 'settings',
  },
]

type ViewMode = 'timeline' | 'table'

export default function ActivityLogsPage() {
  const [view, setView] = useState<ViewMode>('timeline')

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Track and monitor all activities across the entire application
          </p>
        </div>

        {/* View Toggle */}
        <div className="border-border flex items-center gap-1 rounded-lg border bg-white p-1 shadow-sm">
          <button
            onClick={() => setView('timeline')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
              view === 'timeline'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutList className="h-4 w-4" />
            Timeline
          </button>
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
              view === 'table'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Table2 className="h-4 w-4" />
            Table
          </button>
        </div>
      </div>

      {/* View Content */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        {view === 'timeline' ? (
          <TimelineView logs={activityLogs} />
        ) : (
          <TableView logs={activityLogs} />
        )}
      </div>
    </div>
  )
}
