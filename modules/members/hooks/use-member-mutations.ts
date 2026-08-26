'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from '@/lib/toast-messagealert/showSuccessToast'
import type { AddMemberValues } from '@/modules/members/types/member'

interface UseMemberMutationsParams {
  refetchMembers: () => Promise<void>
}

export function useMemberMutations({ refetchMembers }: UseMemberMutationsParams) {
  const router = useRouter()

  const addMember = useCallback(
    async (values: AddMemberValues) => {
      try {
        const response = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message ?? 'Failed to add member')
        }

        await refetchMembers()
        router.refresh()
        showSuccessToast('Successfully added a new member')
        return true
      } catch (error) {
        showErrorToast(error instanceof Error ? error.message : 'Failed to add member')
        return false
      }
    },
    [refetchMembers, router]
  )

  const handleImported = useCallback(async () => {
    await refetchMembers()
    router.refresh()
  }, [refetchMembers, router])

  const handleMemberSaved = useCallback(
    async (onDone: () => void) => {
      await refetchMembers()
      onDone()
      router.refresh()
    },
    [refetchMembers, router]
  )

  return { addMember, handleImported, handleMemberSaved }
}
