import { prisma } from '@/lib/prisma'
import type { Report } from '@prisma/client'
import { createActivityLog } from '@/lib/services/activity-log-service'

export interface ReportPayload {
  type: string
  dateRangeStart: string
  dateRangeEnd: string
  generatedDate: string
  total: number
}

function mapReport(report: Report) {
  return {
    id: report.id,
    type: report.type,
    total: report.total,
    dateRangeStart: report.dateRangeStart,
    dateRangeEnd: report.dateRangeEnd,
    generatedDate: report.generatedDate,
  }
}

export async function listReports() {
  const reports = await prisma.report.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return reports.map(mapReport)
}

export async function createReport(
  payload: ReportPayload,
  actorName: string,
  staffId?: number | null,
  userId?: number | null
) {
  const report = await prisma.report.create({
    data: payload,
  })

  await createActivityLog({
    type: 'created',
    title: 'Report Generated',
    description: 'A report was generated',
    subjectName: 'Report',
    actorName,
    actionLabel: 'Created by',
    staffId: staffId ?? null,
    userId: userId ?? null,
  })

  return mapReport(report)
}
