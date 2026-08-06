import { prisma } from '@/lib/prisma';
import type { ActivityLog } from '@prisma/client';

export type ActivityLogCreatePayload = {
  type: string;
  title: string;
  description: string;
  actorName: string;
  actionLabel: string;
  date: string;
  memberId?: number | null;
  staffId?: number | null;
  userId?: number | null;
};

function mapActivityLog(activityLog: ActivityLog) {
  return {
    id: activityLog.id,
    type: activityLog.type,
    title: activityLog.title,
    description: activityLog.description,
    actorName: activityLog.actorName,
    actionLabel: activityLog.actionLabel,
    date: activityLog.date,
  };
}

export async function listActivityLogs() {
  const activityLogs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return activityLogs.map(mapActivityLog);
}

export async function createActivityLog(payload: ActivityLogCreatePayload) {
  const activityLog = await prisma.activityLog.create({ data: payload });
  return mapActivityLog(activityLog);
}
