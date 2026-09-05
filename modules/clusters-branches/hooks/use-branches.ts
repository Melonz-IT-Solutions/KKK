'use client'

import { useCallback, useEffect, useState } from 'react'

export interface BranchRow {
  id: number
  name: string
  clusterId: number
  cluster: { id: number; name: string }
  createdAt: string
  updatedAt: string | null
}

export function useBranches() {
  const [branches, setBranches] = useState<BranchRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/branches', { cache: 'no-store' })
      .then(res => res.json())
      .then((data: BranchRow[]) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addBranch = useCallback(
    async (name: string, clusterId: number) => {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, clusterId }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to create branch')
      }

      load()
    },
    [load]
  )

  const updateBranch = useCallback(
    async (id: number, name: string, clusterId: number) => {
      const res = await fetch(`/api/branches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, clusterId }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to update branch')
      }

      load()
    },
    [load]
  )

  return { branches, loading, addBranch, updateBranch, refresh: load }
}
