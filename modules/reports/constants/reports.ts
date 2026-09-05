import type { ReportType, GenerateReportFormValues } from '../types/reports'

export const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'Total Members', label: 'Total Members' },
  { value: 'Total Active Users', label: 'Total Active Users' },
  { value: 'Total Inactive Users', label: 'Total Inactive Users' },
]

export const emptyForm: GenerateReportFormValues = {
  dateFrom: '',
  dateTo: '',
  reportType: '',
}
