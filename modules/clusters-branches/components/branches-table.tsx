'use client'

import { useState } from 'react'

import { Pencil, Plus } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import Button from '@/components/button-v2/button'
import PageV2Header from '@/components/headers/page-v2-header'

import AddBranchSheet from './add-branch-sheet'
import EditBranchSheet from './edit-branch-sheet'

import type { BranchRow } from '../hooks/use-branches'
import type { ClusterRow } from '../hooks/use-clusters-admin'

interface BranchesTableProps {
  data: BranchRow[]
  loading: boolean
  clusters: ClusterRow[]
  onAdd: (name: string, clusterId: number) => Promise<void>
  onUpdate: (id: number, name: string, clusterId: number) => Promise<void>
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BranchesTable({ data, loading, clusters, onAdd, onUpdate }: BranchesTableProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<BranchRow | null>(null)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <PageV2Header title="Branches" />
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <div className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/60">
              <TableRow>
                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Branch Name
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Cluster
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Created At
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Updated At
                </TableHead>
                <TableHead className="text-right text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-400">
                    No branches found. Add one to get started.
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                data.map(row => (
                  <TableRow key={row.id} className="font-medium text-slate-700 hover:bg-slate-50/70">
                    <TableCell className="font-medium text-slate-700">{row.name}</TableCell>
                    <TableCell className="text-slate-600">{row.cluster.name}</TableCell>
                    <TableCell className="text-slate-600">{formatDate(row.createdAt)}</TableCell>
                    <TableCell className="text-slate-600">{formatDate(row.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => setEditTarget(row)}
                        className="inline-flex items-center justify-center rounded-md p-1 text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddBranchSheet
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        clusters={clusters}
        onSave={onAdd}
      />

      <EditBranchSheet
        branch={editTarget}
        open={!!editTarget}
        onOpenChange={open => { if (!open) setEditTarget(null) }}
        clusters={clusters}
        onSave={onUpdate}
      />
    </div>
  )
}
