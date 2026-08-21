'use client'

import { useEffect, useState } from 'react'

import type { DashboardActivityLog } from '@/modules/dashboard/types/dashboard'

interface UseDashboardActivityLogsReturn {
  activities: DashboardActivityLog[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardActivityLogs(): UseDashboardActivityLogsReturn {
  const [activities, setActivities] = useState<DashboardActivityLog[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard/activity-logs', {
        method: 'GET',
        cache: 'no-store',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to load activity logs')
      }

      setActivities(data.activities ?? [])
    } catch (error) {
      console.error('Failed to load activity logs:', error)

      setActivities([])

      setError(error instanceof Error ? error.message : 'Failed to load activity logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadActivities()
  }, [])

  return {
    activities,
    loading,
    error,
    refetch: loadActivities,
  }
}
