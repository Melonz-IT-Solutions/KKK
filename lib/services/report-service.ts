import { prisma } from '@/lib/prisma'
import type { Report } from '@prisma/client'

export interface ReportPayload {
  type: string
  dateRangeStart: string
  dateRangeEnd: string
  generatedDate: string
}

function mapReport(report: Report) {
  return {
    id: report.id,
    type: report.type,
    dateRangeStart: report.dateRangeStart,
    dateRangeEnd: report.dateRangeEnd,
    generatedDate: report.generatedDate,
  }
}

export async function listReports() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return reports.map(mapReport)
}

export async function createReport(payload: ReportPayload) {
  const report = await prisma.report.create({ data: payload })
  return mapReport(report)
}
