'use client'

import Button from '@/components/button'

import { Import, UserPlus } from 'lucide-react'

interface MemberV2ActionsProps {
  onImport: () => void
  onAdd: () => void
}

export default function MemberV2Actions({ onImport, onAdd }: MemberV2ActionsProps) {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        className="gap-2 rounded-md border-gray-300 bg-white text-sm text-black hover:bg-gray-50"
        onClick={onImport}
      >
        <Import />
        Import File
      </Button>

      <Button className="text-sm" onClick={onAdd}>
        <UserPlus />
        Add Member
      </Button>
    </div>
  )
}
