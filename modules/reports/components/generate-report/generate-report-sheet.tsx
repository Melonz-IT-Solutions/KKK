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

  const update = <K extends keyof GenerateReportFormValues>(
    key: K,
    value: GenerateReportFormValues[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next: Partial<Record<keyof GenerateReportFormValues, string>> = {}
    if (!form.dateFrom) next.dateFrom = 'Start date is required.'
    if (!form.dateTo) next.dateTo = 'End date is required.'
    if (!form.reportType) next.reportType = 'Select a report type.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const isFormComplete = form.dateFrom !== '' && form.dateTo !== '' && form.reportType !== ''

  const handleGenerate = () => {
    if (!validate()) return
    onGenerate?.(form)
    setForm(emptyForm)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-xl font-semibold">Generate Report</SheetTitle>
          <SheetDescription className="sr-only">Form to Generate Reports .</SheetDescription>
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
              />
              {errors.dateTo && <p className="text-destructive text-sm">{errors.dateTo}</p>}
            </div>

            {/* Report type */}
            <div className="grid gap-2">
              <Label htmlFor="reportType">Report type</Label>
              <Select
                value={form.reportType}
                onValueChange={v => update('reportType', v as ReportType)}
              >
                <SelectTrigger
                  id="reportType"
                  aria-invalid={!!errors.reportType}
                  className="w-full"
                >
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.reportType && <p className="text-destructive text-sm">{errors.reportType}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t px-6 py-4">
          <Button variant="primary" size="full" onClick={handleGenerate} disabled={!isFormComplete}>
            Generate
          </Button>

          <Button variant="outline" size="full" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
