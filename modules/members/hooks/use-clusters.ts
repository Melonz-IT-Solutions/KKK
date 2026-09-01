'use client'

import { useEffect, useState } from 'react'

export interface ClusterBranch {
  id: number
  name: string
}

export interface ClusterWithBranches {
  id: number
  name: string
  branches: ClusterBranch[]
}

export function useClusters() {
  const [clusters, setClusters] = useState<ClusterWithBranches[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clusters')
      .then(res => res.json())
      .then((data: ClusterWithBranches[]) => setClusters(data))
      .catch(() => setClusters([]))
      .finally(() => setLoading(false))
  }, [])

  return { clusters, loading }
}
