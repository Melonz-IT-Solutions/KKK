// modules/reports/components/reports-table.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ReportEntry } from '@/modules/reports/types/reports';

interface ReportsTableProps {
  reports: ReportEntry[];
}

export function ReportsTable({ reports }: ReportsTableProps) {
  return (
    <div className='w-full overflow-x-auto border'>
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead>Report Type</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Generated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <Badge
                  variant='outline'
                  className='rounded-md border-border bg-transparent font-normal text-foreground'
                >
                  {report.type}
                </Badge>
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {report.dateRangeStart} - {report.dateRangeEnd}
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {report.generatedDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
