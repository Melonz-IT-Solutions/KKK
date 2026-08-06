// modules/reports/constants/reports.ts
import type { ReportType, GenerateReportFormValues } from '../types/reports'

export const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'Total Members', label: 'Total Member' },
  { value: 'Total Mortality', label: 'Total Mortality' },
]

export const emptyForm: GenerateReportFormValues = {
  dateFrom: '',
  dateTo: '',
  reportType: '',
}
