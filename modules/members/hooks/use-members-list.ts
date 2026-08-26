'use client'

import { useCallback, useEffect, useState } from 'react'
import { showErrorToast } from '@/lib/toast-messagealert/showSuccessToast'
import type { MemberRow, StatusFilter } from '@/modules/members/types/member'

const MAX_MEMBERS_PER_FETCH = 1000

interface UseMembersListParams {
  isSuperAdmin: boolean
}

interface UseMembersListResult {
  members: MemberRow[]
  loading: boolean
  search: string
  setSearch: (value: string) => void
  selectedBranches: string[]
  setSelectedBranches: (value: string[]) => void
  statusFilter: StatusFilter
  setStatusFilter: (value: StatusFilter) => void
  hasFilters: boolean
  clearFilters: () => void
  refetch: () => Promise<void>
}

export function useMembersList({ isSuperAdmin }: UseMembersListParams): UseMembersListResult {
  const [search, setSearch] = useState('')
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')

  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMembers = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams({
        pageSize: String(MAX_MEMBERS_PER_FETCH),
        search,
        branch: selectedBranches.length > 0 ? selectedBranches.join(',') : 'all',
        status: isSuperAdmin ? statusFilter : 'active',
      })

      const response = await fetch(`/api/members?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to load members')
      }

      setMembers(data.items ?? [])
    } catch (error) {
      console.error('Failed to load members:', error)
      setMembers([])
      showErrorToast(error instanceof Error ? error.message : 'Failed to load members')
    } finally {
      setLoading(false)
    }
  }, [search, selectedBranches, statusFilter, isSuperAdmin])

  useEffect(() => {
    void fetchMembers()
  }, [fetchMembers])

  const hasFilters =
    search !== '' || selectedBranches.length > 0 || (isSuperAdmin && statusFilter !== 'active')

  const clearFilters = useCallback(() => {
    setSearch('')
    setSelectedBranches([])
    setStatusFilter('active')
  }, [])

  return {
    members,
    loading,
    search,
    setSearch,
    selectedBranches,
    setSelectedBranches,
    statusFilter,
    setStatusFilter,
    hasFilters,
    clearFilters,
    refetch: fetchMembers,
  }
}
