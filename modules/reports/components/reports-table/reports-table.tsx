import { Download } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Badge } from '@/components/ui/badge'

import { ReportEntry } from '@/modules/reports/types/reports'

interface ReportsTableProps {
  reports: ReportEntry[]
}

const REPORTS_TABLE_COLUMNS = ['Report Type', 'Total', 'Date Range', 'Generated', 'Action'] as const

function downloadCSV(report: ReportEntry) {
  const headers = ['Report Type', 'Total', 'Date Range Start', 'Date Range End', 'Generated Date']
  const row = [
    report.type,
    String(report.total),
    report.dateRangeStart,
    report.dateRangeEnd,
    report.generatedDate,
  ]

  const csv = [headers.join(','), row.join(',')].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `report-${report.type.toLowerCase().replace(/\s+/g, '-')}-${report.id}.csv`
  link.click()

  URL.revokeObjectURL(url)
}

export function ReportsTable({ reports }: ReportsTableProps) {
  return (
    // <div className="mx-auto w-full">
    <div className="shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60">
              {REPORTS_TABLE_COLUMNS.map(col => (
                <TableHead
                  key={col}
                  className="text-xs font-semibold tracking-wide whitespace-nowrap text-slate-500 uppercase"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {reports.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={REPORTS_TABLE_COLUMNS.length}
                  className="py-10 text-center text-sm text-slate-400"
                >
                  No reports found.
                </TableCell>
              </TableRow>
            )}

            {reports.map(report => (
              <TableRow key={report.id} className="hover:bg-slate-50/70">
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-border text-foreground rounded-md bg-transparent font-normal"
                  >
                    {report.type}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm text-slate-600">{report.total}</TableCell>

                <TableCell className="text-sm text-slate-600">
                  {report.dateRangeStart} - {report.dateRangeEnd}
                </TableCell>

                <TableCell className="text-sm text-slate-600">{report.generatedDate}</TableCell>

                <TableCell>
                  <button
                    type="button"
                    onClick={() => downloadCSV(report)}
                    className="inline-flex items-center justify-center rounded-md p-1 text-slate-700 hover:bg-slate-100"
                    title="Download CSV"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    // </div>
  )
}
