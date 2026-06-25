'use client'

import * as React from 'react'
import { FileBarChart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportType = 'Total Members' | 'Total Mortality'

type Report = {
  id: string
  reportType: ReportType
  dateFrom: string
  dateTo: string
  generatedAt: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    reportType: 'Total Members',
    dateFrom: '2025-01-01',
    dateTo: '2025-03-31',
    generatedAt: '2025-04-01',
  },
  {
    id: '2',
    reportType: 'Total Mortality',
    dateFrom: '2025-01-01',
    dateTo: '2025-06-30',
    generatedAt: '2025-07-01',
  },
  {
    id: '3',
    reportType: 'Total Members',
    dateFrom: '2025-04-01',
    dateTo: '2025-06-30',
    generatedAt: '2025-07-02',
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Generate Report Dialog ───────────────────────────────────────────────────

function GenerateReportDialog({ onGenerate }: { onGenerate: (r: Report) => void }) {
  const [open, setOpen] = React.useState(false)
  const [dateFrom, setDateFrom] = React.useState('')
  const [dateTo, setDateTo] = React.useState('')
  const [reportType, setReportType] = React.useState<ReportType | ''>('')

  function handleGenerate() {
    if (!dateFrom || !dateTo || !reportType) return
    onGenerate({
      id: Date.now().toString(),
      reportType: reportType as ReportType,
      dateFrom,
      dateTo,
      generatedAt: new Date().toISOString().split('T')[0],
    })
    setOpen(false)
    setDateFrom('')
    setDateTo('')
    setReportType('')
  }

  const isValid = dateFrom && dateTo && reportType

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <FileBarChart className="size-4" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date-from">Date From</Label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date-to">Date To</Label>
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="report-type">Report Type</Label>
            <Select
              value={reportType}
              onValueChange={(v) => setReportType(v as ReportType)}
            >
              <SelectTrigger id="report-type" className="w-full">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Total Members">Total Members</SelectItem>
                <SelectItem value="Total Mortality">Total Mortality</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={!isValid}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [reports, setReports] = React.useState<Report[]>(MOCK_REPORTS)

  function handleGenerate(report: Report) {
    setReports((prev) => [report, ...prev])
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Toolbar */}
      <div className="flex justify-end">
        <GenerateReportDialog onGenerate={handleGenerate} />
      </div>

      {/* Table */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Type</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Generated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-muted-foreground py-8 text-center"
                >
                  No reports generated yet.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge
                      variant={
                        report.reportType === 'Total Members' ? 'default' : 'secondary'
                      }
                    >
                      {report.reportType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(report.dateFrom)} — {formatDate(report.dateTo)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(report.generatedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
