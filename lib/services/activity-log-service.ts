import { prisma } from '@/lib/prisma'

export type ActivityLogCreatePayload = {
  type: string
  title: string
  description: string
  subjectName: string
  actorName: string
  actionLabel: string
  memberId?: number | null
  userId?: number | null
}

export type ActivityLogResult = {
  id: string
  type: 'created' | 'updated' | 'imported'
  title: string
  description: string
  subjectName: string
  actorName: string
  actionLabel: 'Created by' | 'Updated by'
  date: string
}

function formatActivityDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function mapActivityLog(activityLog: {
  id: number
  type: string
  title: string
  description: string
  subjectName: string
  actorName: string
  actionLabel: string
  date: string
}) {
  return {
    id: String(activityLog.id),

    type: activityLog.type as 'created' | 'updated' | 'imported',

    title: activityLog.title,

    description: activityLog.description,

    subjectName: activityLog.subjectName,

    actorName: activityLog.actorName,

    actionLabel: activityLog.actionLabel as 'Created by' | 'Updated by',

    date: activityLog.date,
  }
}

export async function listActivityLogs(): Promise<ActivityLogResult[]> {
  const activityLogs = await prisma.activityLog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 100,
  })

  return activityLogs.map(mapActivityLog)
}

const DUPLICATE_WINDOW_MS = 5000

export async function createActivityLog(
  payload: ActivityLogCreatePayload
): Promise<ActivityLogResult> {
  const windowStart = new Date(Date.now() - DUPLICATE_WINDOW_MS)

  const recentDuplicate = await prisma.activityLog.findFirst({
    where: {
      type: payload.type,
      subjectName: payload.subjectName,
      description: payload.description,
      actorName: payload.actorName,
      createdAt: {
        gte: windowStart,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (recentDuplicate) {
    return mapActivityLog(recentDuplicate)
  }

  const now = new Date()

  const activityLog = await prisma.activityLog.create({
    data: {
      type: payload.type,
      title: payload.title,
      description: payload.description,
      subjectName: payload.subjectName,
      actorName: payload.actorName,
      actionLabel: payload.actionLabel,

      // Example: August 10, 2026
      date: formatActivityDate(now),

      memberId: payload.memberId ?? null,
      userId: payload.userId ?? null,
    },
  })

  return mapActivityLog(activityLog)
}
