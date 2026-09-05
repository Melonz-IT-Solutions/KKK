'use client'

import { useEffect, useState } from 'react'

import Button from '@/components/button-v2/button'
import Input from '@/components/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import type { ClusterRow } from '../hooks/use-clusters-admin'

interface EditClusterSheetProps {
  cluster: ClusterRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: number, name: string) => Promise<void>
}

export default function EditClusterSheet({
  cluster,
  open,
  onOpenChange,
  onSave,
}: EditClusterSheetProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (cluster) {
      setName(cluster.name)
      setError('')
    }
  }, [cluster])

  const handleSave = async () => {
    if (isSaving || !cluster) return

    const trimmed = name.trim()
    if (!trimmed) {
      setError('Cluster name is required.')
      return
    }

    setIsSaving(true)
    try {
      await onSave(cluster.id, trimmed)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save cluster.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (isSaving) return
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={next => {
        if (!next && isSaving) return
        onOpenChange(next)
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-xl font-semibold">Edit Cluster</SheetTitle>
          <SheetDescription className="sr-only">Form to edit an existing cluster.</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-4 p-6">
            <div className="grid gap-2">
              <Label htmlFor="edit-cluster-name">Cluster Name</Label>
              <Input
                id="edit-cluster-name"
                placeholder="e.g. Cluster A"
                value={name}
                onChange={e => {
                  setName(e.target.value)
                  setError('')
                }}
                aria-invalid={!!error}
                disabled={isSaving}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t px-6 py-4">
          <Button
            variant="primary"
            size="full"
            onClick={() => void handleSave()}
            disabled={!name.trim() || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outline" size="full" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
