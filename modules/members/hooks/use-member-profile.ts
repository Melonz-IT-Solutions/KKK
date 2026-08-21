'use client'

import { useCallback, useState } from 'react'
import { showErrorToast } from '@/lib/toast-messagealert/showSuccessToast'
import type { getMemberProfile } from '@/lib/services/member-service'

export type MemberProfile = NonNullable<Awaited<ReturnType<typeof getMemberProfile>>>

interface UseMemberProfileResult {
  selectedMember: MemberProfile | null
  loadingProfile: boolean
  loadMemberProfile: (memberId: number) => Promise<void>
  clearSelectedMember: () => void
}

export function useMemberProfile(): UseMemberProfileResult {
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const loadMemberProfile = useCallback(async (memberId: number) => {
    if (!Number.isInteger(memberId) || memberId <= 0) {
      showErrorToast('Invalid member ID')
      return
    }

    try {
      setLoadingProfile(true)

      const response = await fetch(`/api/members/${memberId}`, {
        method: 'GET',
        cache: 'no-store',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message ?? `Failed to load member profile (${response.status})`)
      }

      if (!data?.principal?.id) {
        throw new Error('Member profile returned without a valid member ID')
      }

      setSelectedMember(data)
    } catch (error) {
      console.error('[Member Edit] Failed:', error)
      showErrorToast(error instanceof Error ? error.message : 'Failed to load member profile')
    } finally {
      setLoadingProfile(false)
    }
  }, [])

  const clearSelectedMember = useCallback(() => setSelectedMember(null), [])

  return { selectedMember, loadingProfile, loadMemberProfile, clearSelectedMember }
}
