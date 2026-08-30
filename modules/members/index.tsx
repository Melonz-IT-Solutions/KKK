'use client'

import { useState } from 'react'
import PageV2Header from '@/components/headers/page-v2-header'
import MemberV2Filters from '@/modules/members/components/member-view/filters'
import MemberV2Actions from '@/modules/members/components/member-view/actions'
import MemberV2Table from '@/modules/members/components/member-table/member-table'
import ImportMemberSheet from '@/modules/members/components/import-table'
import { AddMemberSheet } from '@/modules/members/components/add-member/member-v2-addmember'
import EditMemberProfile from '@/modules/members/components/profile/edit-member-profile'
import { useMembersList } from '@/modules/members/hooks/use-members-list'
import { useMemberProfile } from '@/modules/members/hooks/use-member-profile'
import { useMemberMutations } from '@/modules/members/hooks/use-member-mutations'
import type { AddMemberValues } from '@/modules/members/types/member'

interface MemberV2PageProps {
  userRole: string
}

export default function MemberV2Page({ userRole }: MemberV2PageProps) {
  const isSuperAdmin = userRole === 'SUPER_ADMIN'

  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  const {
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
    refetch: refetchMembers,
  } = useMembersList({ isSuperAdmin })

  const { selectedMember, loadMemberProfile, clearSelectedMember } =
    useMemberProfile()

  const { addMember, handleImported, handleMemberSaved } = useMemberMutations({
    refetchMembers,
  })

  const onAddMember = async (values: AddMemberValues) => {
    const ok = await addMember(values)
    if (ok) setIsAddMemberOpen(false)
  }

  const onSaveEdit = () => handleMemberSaved(clearSelectedMember)

  if (selectedMember) {
    return (
      <EditMemberProfile
        profile={selectedMember}
        onCancel={clearSelectedMember}
        onSaved={onSaveEdit}
      />
    )
  }

  return (
    <div className="p-4">
      <PageV2Header title="Members" description="" />

      <div className="flex justify-between">
        <MemberV2Filters
          search={search}
          selectedBranches={selectedBranches}
          statusFilter={statusFilter}
          isSuperAdmin={isSuperAdmin}
          hasFilters={hasFilters}
          onSearchChange={setSearch}
          onBranchChange={setSelectedBranches}
          onStatusChange={setStatusFilter}
          onClearFilters={clearFilters}
        />

        <MemberV2Actions
          onImport={() => setIsImportOpen(true)}
          onAdd={() => setIsAddMemberOpen(true)}
        />
      </div>

      <div className="py-6">
        <MemberV2Table data={members} loading={loading} onDeleted={refetchMembers} onEdit={loadMemberProfile} />
      </div>

      <AddMemberSheet
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onSave={onAddMember}
      />

      <ImportMemberSheet
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImported={handleImported}
      />
    </div>
  )
}
