'use client'

import { useCallback, useEffect, useState } from 'react'

export interface ClusterRow {
  id: number
  name: string
  branches: { id: number; name: string }[]
  createdAt: string
  updatedAt: string | null
}

export function useClustersAdmin() {
  const [clusters, setClusters] = useState<ClusterRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/clusters?scope=admin', { cache: 'no-store' })
      .then(res => res.json())
      .then((data: ClusterRow[]) => setClusters(Array.isArray(data) ? data : []))
      .catch(() => setClusters([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addCluster = useCallback(
    async (name: string) => {
      const res = await fetch('/api/clusters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? 'Failed to create cluster')
      }

      load()
    },
    [load]
  )

  const updateCluster = useCallback(
    async (id: number, name: string) => {
      const res = await fetch(`/api/clusters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? 'Failed to update cluster')
      }

      load()
    },
    [load]
  )

  return { clusters, loading, addCluster, updateCluster, refresh: load }
}
