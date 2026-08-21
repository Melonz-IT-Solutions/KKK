'use client'

import { useState } from 'react'
import { MoreVertical } from 'lucide-react'

interface RowMenuProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function RowMenu({ onView, onEdit, onDelete }: RowMenuProps) {
  const [open, setOpen] = useState(false)

  const closeMenu = () => {
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        aria-label="Row actions"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-36 overflow-hidden rounded-md border border-slate-200 bg-white shadow-md">
          <button
            type="button"
            onClick={() => {
              closeMenu()
              onView()
            }}
            className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            View details
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu()
              onEdit()
            }}
            className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu()
              onDelete()
            }}
            className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
