// modules/reports/components/reports-table/reports-table.tsx
'use client'

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

const REPORTS_TABLE_COLUMNS = ['Report Type', 'Date Range', 'Generated'] as const

export function ReportsTable({ reports }: ReportsTableProps) {
  return (
    <div className="mx-auto w-full">
      <div className="shadow-sm">
        <div className="overflow-x-auto border">
          <Table className="w-full">
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
                  <TableCell className="text-sm text-slate-600">
                    {report.dateRangeStart} - {report.dateRangeEnd}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{report.generatedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
