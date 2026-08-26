'use client'

import { showErrorToast, showSuccessToast } from '@/lib/toast-messagealert/showSuccessToast'

import { useEditMemberProfile } from '@/modules/members/hooks/use-edit-member-profile'

import type { MemberProfile } from '@/modules/members/types/member-profile'

import { EditMemberHeader } from './member-header'
import { PrincipalMemberForm } from './principal-member-form'
import { BeneficiariesForm } from './beneficiaries-form'
import { DependentsForm } from './dependents-form'
import { EditMemberActions } from './member-actions'

interface EditMemberProfileProps {
  profile: MemberProfile
  onSaved?: () => void | Promise<void>
  onCancel?: () => void
}

export default function EditMemberProfile({ profile, onSaved, onCancel }: EditMemberProfileProps) {
  const { formState, saving, updatePrincipal, updateBeneficiary, updateDependent, save } =
    useEditMemberProfile(profile)

  async function handleSave() {
    try {
      await save()

      showSuccessToast('Member profile updated successfully')

      await onSaved?.()
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to update member profile')
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <EditMemberHeader memberId={formState.principal.id} />

      <PrincipalMemberForm principal={formState.principal} onChange={updatePrincipal} />

      <BeneficiariesForm beneficiaries={formState.beneficiaries} onChange={updateBeneficiary} />

      <DependentsForm dependents={formState.dependents} onChange={updateDependent} />

      <EditMemberActions saving={saving} onSave={handleSave} onCancel={onCancel} />
    </div>
  )
}
