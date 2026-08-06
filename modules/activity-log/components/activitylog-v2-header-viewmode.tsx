// modules/activity-logs/components/activity-logs-header.tsx
'use client'

import { Button } from '@/components/ui/button'
import { LayoutGrid, Table2 } from 'lucide-react'
import { ActivityViewMode } from '@/types/activelog'

interface ActivityLogsHeaderProps {
  view: ActivityViewMode
  onViewChange: (view: ActivityViewMode) => void
}

export function ActivityLogsHeader({ view, onViewChange }: ActivityLogsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track all activities of the entire application.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={view === 'timeline' ? 'default' : 'outline'}
          className={
            view === 'timeline' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
          }
          onClick={() => onViewChange('timeline')}
        >
          Timeline View
          <LayoutGrid className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={view === 'table' ? 'default' : 'outline'}
          className={
            view === 'table' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
          }
          onClick={() => onViewChange('table')}
        >
          Table View
          <Table2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
