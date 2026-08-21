'use client'

import { toast } from 'sonner'
import { Check, X, AlertCircle } from 'lucide-react'

export function showSuccessToast(message: string) {
  toast.custom(
    t => (
      <div className="flex w-95 items-start gap-3 rounded-lg bg-green-800 p-4 text-white shadow-lg">
        {/* Success icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
          <Check className="h-4 w-4 text-green-800" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">Success!</p>

          <p className="mt-1 text-sm text-white">{message}</p>

          <p className="mt-1 text-xs text-white/70">{getTimestamp()}</p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => toast.dismiss(t)}
          className="shrink-0 rounded-sm text-white/80 transition-colors hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    {
      duration: 4000,
      position: 'top-right',
    }
  )
}

export function showErrorToast(message: string) {
  toast.custom(
    t => (
      <div className="flex w-95 items-start gap-3 rounded-lg bg-red-700 p-4 text-white shadow-lg">
        {/* Error icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
          <AlertCircle className="h-4 w-4 text-red-700" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">Error!</p>

          <p className="mt-1 text-sm text-white">{message}</p>

          <p className="mt-1 text-xs text-white/70">{getTimestamp()}</p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => toast.dismiss(t)}
          className="shrink-0 rounded-sm text-white/80 transition-colors hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    {
      duration: 4000,
      position: 'top-right',
    }
  )
}

function getTimestamp() {
  const now = new Date()

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const date = now.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  return `${time} ${date}`
}
