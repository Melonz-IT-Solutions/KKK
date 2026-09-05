'use client'

import { useEffect, useState } from 'react'

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

import type { BranchRow } from '../hooks/use-branches'

interface ClusterOption {
  id: number
  name: string
}

interface EditBranchSheetProps {
  branch: BranchRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  clusters: ClusterOption[]
  onSave: (id: number, name: string, clusterId: number) => Promise<void>
}

export default function EditBranchSheet({
  branch,
  open,
  onOpenChange,
  clusters,
  onSave,
}: EditBranchSheetProps) {
  const [name, setName] = useState('')
  const [clusterId, setClusterId] = useState<string>('')
  const [errors, setErrors] = useState<{ name?: string; clusterId?: string }>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (branch) {
      setName(branch.name)
      setClusterId(String(branch.clusterId))
      setErrors({})
    }
  }, [branch])

  const isComplete = name.trim() !== '' && clusterId !== ''

  const validate = () => {
    const next: { name?: string; clusterId?: string } = {}
    if (!name.trim()) next.name = 'Branch name is required.'
    if (!clusterId) next.clusterId = 'Select a cluster.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = async () => {
    if (isSaving || !branch) return
    if (!validate()) return

    setIsSaving(true)
    try {
      await onSave(branch.id, name.trim(), Number(clusterId))
      onOpenChange(false)
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        name: err instanceof Error ? err.message : 'Failed to save branch.',
      }))
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
          <SheetTitle className="text-xl font-semibold">Edit Branch</SheetTitle>
          <SheetDescription className="sr-only">Form to edit an existing branch.</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-4 p-6">
            {/* Branch Name */}
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-name">Branch Name</Label>
              <Input
                id="edit-branch-name"
                placeholder="e.g. Branch 1"
                value={name}
                onChange={e => {
                  setName(e.target.value)
                  setErrors(prev => ({ ...prev, name: undefined }))
                }}
                aria-invalid={!!errors.name}
                disabled={isSaving}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>

            {/* Cluster */}
            <div className="grid gap-2">
              <Label htmlFor="edit-branch-cluster">Cluster</Label>
              <Select
                value={clusterId}
                onValueChange={value => {
                  setClusterId(value)
                  setErrors(prev => ({ ...prev, clusterId: undefined }))
                }}
                disabled={isSaving}
              >
                <SelectTrigger
                  id="edit-branch-cluster"
                  aria-invalid={!!errors.clusterId}
                  className="w-full"
                >
                  <SelectValue placeholder="Select Cluster" />
                </SelectTrigger>
                <SelectContent>
                  {clusters.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clusterId && <p className="text-destructive text-sm">{errors.clusterId}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t px-6 py-4">
          <Button
            variant="primary"
            size="full"
            onClick={() => void handleSave()}
            disabled={!isComplete || isSaving}
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
