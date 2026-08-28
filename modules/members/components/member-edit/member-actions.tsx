'use client'

import { Check, X } from 'lucide-react'

import { Button } from '@/components/button-v2/button'

interface EditMemberActionsProps {
  saving: boolean
  onSave: () => void
  onCancel?: () => void
}

export function EditMemberActions({ saving, onSave, onCancel }: EditMemberActionsProps) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-emerald-100 bg-white/95 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="hidden text-xs text-slate-500 sm:block">
          Review the information before saving changes.
        </p>

        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={saving}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <X className="mr-1.5 size-4" />
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
          >
            <Check className="mr-1.5 size-4" />

            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
