// modules/reports/types/report.ts
export type ReportType = 'Total Members' | 'Total Active Users' | 'Total Inactive Users'

export interface ReportEntry {
  id: number
  type: 'MEMBER' | 'ACTIVE_USERS' | 'INACTIVE_USERS'
  total: number
  dateRangeStart: string
  dateRangeEnd: string
  generatedDate: string
}

export interface GenerateReportFormValues {
  dateFrom: string
  dateTo: string
  reportType: ReportType | ''
}

export interface GenerateReportSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate?: (values: GenerateReportFormValues) => void
}
