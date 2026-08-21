import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'

interface FormFieldProps {
  label: string
  children: ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
      </Label>

      {children}
    </div>
  )
}
