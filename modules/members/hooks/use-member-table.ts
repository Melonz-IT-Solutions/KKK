'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { usePagination } from '@/lib/hooks/use-pagination'

import type { MemberRow } from '@/modules/members/types/member'

interface UseMemberTableProps {
  data: MemberRow[]
  onDeleted?: () => void | Promise<void>
  onEdit: (memberId: number) => void
}

interface UseMemberTableReturn {
  deleteMember: MemberRow | null
  deleting: boolean
  page: number
  pageSize: number
  pageCount: number
  start: number
  end: number
  pageRows: MemberRow[]
  setDeleteMember: React.Dispatch<React.SetStateAction<MemberRow | null>>
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  handleAction: (kind: 'view' | 'edit' | 'delete', row: MemberRow) => void
  confirmDelete: () => Promise<void>
}

export function useMemberTable({
  data,
  onDeleted,
  onEdit,
}: UseMemberTableProps): UseMemberTableReturn {
  const router = useRouter()

  const [deleteMember, setDeleteMember] = useState<MemberRow | null>(null)

  const [deleting, setDeleting] = useState(false)

  const { page, pageSize, pageCount, start, end, setPage, setPageSize } = usePagination({
    totalItems: data.length,
    initialPageSize: 10,
  })

  const pageRows = data.slice(start, end)

  function handleAction(kind: 'view' | 'edit' | 'delete', row: MemberRow) {
    if (kind === 'view') {
      router.push(`/members/${row.id}`)
      return
    }

    if (kind === 'edit') {
      console.log('[Member Table] Editing member ID:', row.id)

      onEdit(row.id)
      return
    }

    if (kind === 'delete') {
      setDeleteMember(row)
    }
  }

  async function confirmDelete() {
    if (!deleteMember) {
      return
    }

    try {
      setDeleting(true)

      const response = await fetch(`/api/members/${deleteMember.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message ?? 'Failed to hide member')
      }

      setDeleteMember(null)

      await onDeleted?.()
    } catch (error) {
      console.error('Failed to hide member:', error)
    } finally {
      setDeleting(false)
    }
  }

  return {
    deleteMember,
    deleting,

    page,
    pageSize,
    pageCount,

    start,
    end,

    pageRows,

    setDeleteMember,
    setPage,
    setPageSize,

    handleAction,
    confirmDelete,
  }
}
