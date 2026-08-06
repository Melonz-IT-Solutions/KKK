// modules/reports/types/report.ts
export type ReportType = 'Total Members' | 'Total Mortality'

export interface ReportEntry {
  id: string
  type: ReportType
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
