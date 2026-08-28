'use client'

import { useState } from 'react'
import { MoreVertical, Eye, Pencil, XCircle } from 'lucide-react'

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
            className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <Eye className="mr-2 h-4 w-4" /> View Details
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu()
              onEdit()
            }}
            className="flex w-full cursor-pointer items-center border-b px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu()
              onDelete()
            }}
            className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <XCircle className="mr-2 h-4 w-4" /> Set as Inactive
          </button>
        </div>
      )}
    </div>
  )
}
