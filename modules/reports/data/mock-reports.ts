// modules/reports/data/mock-reports.ts
import { ReportEntry } from '@/modules/reports/types/reports';

export const mockReports: ReportEntry[] = [
  {
    id: '1',
    type: 'Total Members',
    dateRangeStart: 'Jan 01, 2026',
    dateRangeEnd: 'Jan 30, 2026',
    generatedDate: 'Feb 05, 2026',
  },
  {
    id: '2',
    type: 'Total Mortality',
    dateRangeStart: 'Feb 01, 2026',
    dateRangeEnd: 'March 30, 2026',
    generatedDate: 'March 31, 2026',
  },
];
