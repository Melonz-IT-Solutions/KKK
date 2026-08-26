'use client'

import { useState } from 'react'
import { ActivityLogsHeader } from '@/modules/activity-log/components/header-viewmode'
import { ActivityLogsTimeline } from '@/modules/activity-log/components/timeline'
import { ActivityLogsTable } from '@/modules/activity-log/components/table'
import type { ActivityLogEntry, ActivityViewMode } from '@/types/activelog'

const PAGE_SIZE = 7

interface ActivityLogsClientProps {
  logs: ActivityLogEntry[]
}

export function ActivityLogsClient({ logs }: ActivityLogsClientProps) {
  const [view, setView] = useState<ActivityViewMode>('timeline')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visibleLogs = logs.slice(0, visibleCount)
  const hasMore = visibleCount < logs.length

  return (
    <>
      <ActivityLogsHeader view={view} onViewChange={setView} />

      <div className="mt-8">
        {view === 'timeline' ? (
          <ActivityLogsTimeline logs={visibleLogs} />
        ) : (
          <ActivityLogsTable logs={visibleLogs} />
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
            className="text-muted-foreground hover:text-foreground text-sm underline"
          >
            Load More
          </button>
        </div>
      )}
    </>
  )
}
