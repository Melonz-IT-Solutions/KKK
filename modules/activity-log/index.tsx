import { prisma } from '@/lib/prisma'
import { ActivityLogsClient } from '@/modules/activity-log/components/clients'
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

    type:
      log.type === 'created' || log.type === 'updated' || log.type === 'imported'
        ? log.type
        : 'updated',

    title: log.title,

    description: log.description,

    subjectName: log.subjectName,

    actorName: log.actorName,

    actionLabel:
      log.actionLabel === 'Created by' || log.actionLabel === 'Updated by'
        ? log.actionLabel
        : 'Updated by',

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
