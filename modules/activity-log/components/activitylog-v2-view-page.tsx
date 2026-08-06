import { prisma } from '@/lib/prisma'
import { ActivityLogsClient } from '@/modules/activity-log/components/activitylog-v2-clients'
import type { ActivityLogEntry } from '@/types/activelog'

async function getActivityLogs(): Promise<ActivityLogEntry[]> {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100, // fetch a reasonable batch; client paginates within this
  })

  return logs.map(log => ({
    ...log,
    id: String(log.id),
  })) as ActivityLogEntry[]
}

export default async function ActivityLogsPage() {
  const logs = await getActivityLogs()

  return (
    <div className="w-full p-4 md:p-6">
      <ActivityLogsClient logs={logs} />
    </div>
  )
}
