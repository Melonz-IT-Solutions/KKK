import { prisma } from '@/lib/prisma'
import { ActivityLogsClient } from '@/modules/activity-log/components/activitylog-v2-clients'
import type { ActivityLogEntry } from '@/types/activelog'

async function getActivityLogs(): Promise<ActivityLogEntry[]> {
  const logs = await prisma.activityLog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 100,
  })

  return logs.map(log => ({
    id: String(log.id),
    type: log.type as 'created' | 'updated' | 'imported',
    title: log.title,
    description: log.description,
    subjectName: log.subjectName,
    actorName: log.actorName,
    actionLabel: log.actionLabel as 'Created by' | 'Updated by',

    // Format the date for the Activity Log UI
    date: new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(log.createdAt),
  }))
}

export default async function ActivityLogsPage() {
  const logs = await getActivityLogs()

  return (
    <div className="w-full p-4 md:p-6">
      <ActivityLogsClient logs={logs} />
    </div>
  )
}
