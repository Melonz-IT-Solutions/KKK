// app/reports/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { ReportsHeader } from '@/modules/reports/components/reports-header'
import { ReportsTable } from '@/modules/reports/components/reports-table'
import { GenerateReportSheet } from '@/modules/reports/components/generate-report-sheet'
import type { GenerateReportFormValues, ReportEntry } from '@/modules/reports/types/reports'

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportEntry[]>([])
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)

  const loadReports = async () => {
    const response = await fetch('/api/reports')
    const data = await response.json()
    setReports(data ?? [])
  }

  useEffect(() => {
    void loadReports()
  }, [])

  const handleGenerate = async (values: GenerateReportFormValues) => {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: values.reportType,
        dateRangeStart: values.dateFrom,
        dateRangeEnd: values.dateTo,
        generatedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      }),
    })
    if (response.ok) {
      await loadReports()
    }
  }

  return (
    <div className="w-full p-4 md:p-6">
      <div className=" ">
        <ReportsHeader onGenerateReport={() => setIsGenerateOpen(true)} />

        <div className="mt-6">
          <ReportsTable reports={reports} />
        </div>
      </div>

      <GenerateReportSheet
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
        onGenerate={handleGenerate}
      />
    </div>
  )
}
