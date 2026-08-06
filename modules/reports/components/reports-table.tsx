// modules/reports/components/reports-table.tsx
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

export function ReportsTable({ reports }: ReportsTableProps) {
  return (
    <div className="w-full overflow-x-auto border">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Report Type</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Generated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map(report => (
            <TableRow key={report.id}>
              <TableCell>
                <Badge
                  variant="outline"
                  className="border-border text-foreground rounded-md bg-transparent font-normal"
                >
                  {report.type}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {report.dateRangeStart} - {report.dateRangeEnd}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {report.generatedDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
