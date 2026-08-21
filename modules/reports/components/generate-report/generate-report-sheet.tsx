'use client'

import { useState } from 'react'

import Button from '@/components/button-v2/button'
import Input from '@/components/input'

import { Label } from '@/components/ui/label'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import type {
  GenerateReportFormValues,
  GenerateReportSheetProps,
  ReportType,
} from '@/modules/reports/types/reports'

import { REPORT_TYPE_OPTIONS, emptyForm } from '@/modules/reports/constants/reports'

export function GenerateReportSheet({ open, onOpenChange, onGenerate }: GenerateReportSheetProps) {
  const [form, setForm] = useState<GenerateReportFormValues>(emptyForm)

  const [errors, setErrors] = useState<Partial<Record<keyof GenerateReportFormValues, string>>>({})

  // ---------------------------------------------------------------------------
  // Saving state
  // ---------------------------------------------------------------------------

  const [isGenerating, setIsGenerating] = useState(false)

  // ---------------------------------------------------------------------------
  // Update field
  // ---------------------------------------------------------------------------

  const update = <K extends keyof GenerateReportFormValues>(
    key: K,
    value: GenerateReportFormValues[K]
  ) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }))

    setErrors(prev => ({
      ...prev,
      [key]: undefined,
    }))
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const validate = () => {
    const next: Partial<Record<keyof GenerateReportFormValues, string>> = {}

    if (!form.dateFrom) {
      next.dateFrom = 'Start date is required.'
    }

    if (!form.dateTo) {
      next.dateTo = 'End date is required.'
    }

    if (!form.reportType) {
      next.reportType = 'Select a report type.'
    }

    // Make sure the date range is valid.
    if (form.dateFrom && form.dateTo && form.dateFrom > form.dateTo) {
      next.dateTo = 'End date must be after the start date.'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  // ---------------------------------------------------------------------------
  // Form state
  // ---------------------------------------------------------------------------

  const isFormComplete = form.dateFrom !== '' && form.dateTo !== '' && form.reportType !== ''

  // ---------------------------------------------------------------------------
  // Generate
  // ---------------------------------------------------------------------------

  const handleGenerate = async () => {
    /**
     * Prevent fast double clicks.
     */
    if (isGenerating) {
      return
    }

    /**
     * Validate before locking the form.
     */
    if (!validate()) {
      return
    }

    /**
     * Lock immediately.
     */
    setIsGenerating(true)

    try {
      /**
       * Supports both synchronous and asynchronous
       * onGenerate callbacks.
       */
      await onGenerate?.(form)

      /**
       * Only reset and close after generation
       * successfully completes.
       */
      setForm(emptyForm)
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      /**
       * Always unlock the form.
       */
      setIsGenerating(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  const handleCancel = () => {
    /**
     * Don't allow cancellation while the report
     * is being generated.
     */
    if (isGenerating) {
      return
    }

    setForm(emptyForm)
    setErrors({})
    onOpenChange(false)
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Sheet
      open={open}
      onOpenChange={nextOpen => {
        /**
         * Prevent closing the Sheet while
         * report generation is running.
         */
        if (!nextOpen && isGenerating) {
          return
        }

        onOpenChange(nextOpen)
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-xl font-semibold">Generate Report</SheetTitle>

          <SheetDescription className="sr-only">Form to Generate Reports.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-4">
            {/* Date from */}
            <div className="grid gap-2">
              <Label htmlFor="dateFrom">Date from</Label>

              <Input
                id="dateFrom"
                type="date"
                value={form.dateFrom}
                onChange={e => update('dateFrom', e.target.value)}
                aria-invalid={!!errors.dateFrom}
                disabled={isGenerating}
              />

              {errors.dateFrom && <p className="text-destructive text-sm">{errors.dateFrom}</p>}
            </div>

            {/* Date to */}
            <div className="grid gap-2">
              <Label htmlFor="dateTo">Date to</Label>

              <Input
                id="dateTo"
                type="date"
                value={form.dateTo}
                onChange={e => update('dateTo', e.target.value)}
                aria-invalid={!!errors.dateTo}
                disabled={isGenerating}
              />

              {errors.dateTo && <p className="text-destructive text-sm">{errors.dateTo}</p>}
            </div>

            {/* Report type */}
            <div className="grid gap-2">
              <Label htmlFor="reportType">Report type</Label>

              <Select
                value={form.reportType}
                onValueChange={value => update('reportType', value as ReportType)}
                disabled={isGenerating}
              >
                <SelectTrigger
                  id="reportType"
                  aria-invalid={!!errors.reportType}
                  className="w-full"
                >
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>

                <SelectContent>
                  {REPORT_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.reportType && <p className="text-destructive text-sm">{errors.reportType}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t px-6 py-4">
          <Button
            variant="primary"
            size="full"
            onClick={() => void handleGenerate()}
            disabled={!isFormComplete || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>

          <Button variant="outline" size="full" onClick={handleCancel} disabled={isGenerating}>
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
