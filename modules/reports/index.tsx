'use client'

import { useEffect, useState } from 'react'

import { ReportsHeader } from '@/modules/reports/components/reports-table/reports-header'
import { ReportsTable } from '@/modules/reports/components/reports-table/reports-table'
import { GenerateReportSheet } from '@/modules/reports/components/generate-report/generate-report-sheet'
import type { GenerateReportFormValues, ReportEntry } from '@/modules/reports/types/reports'

import { showSuccessToast, showErrorToast } from '@/lib/toast-messagealert/showSuccessToast'

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportEntry[]>([])
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)

  const loadReports = async () => {
    try {
      const response = await fetch('/api/reports')

      if (!response.ok) {
        throw new Error('Failed to load reports')
      }

      const data = await response.json()

      setReports(data ?? [])
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to load reports')
    }
  }

  useEffect(() => {
    void loadReports()
  }, [])

  const handleGenerate = async (values: GenerateReportFormValues) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.message ?? 'Failed to generate report')
      }

      await loadReports()

      showSuccessToast('Successfully generated a new report')

      setIsGenerateOpen(false)
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to generate report')
    }
  }

  return (
    <div className="p-4">
      <ReportsHeader onGenerateReport={() => setIsGenerateOpen(true)} />

      <div className="mt-6">
        <ReportsTable reports={reports} />
      </div>

      <GenerateReportSheet
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
        onGenerate={handleGenerate}
      />
    </div>
  )
}
