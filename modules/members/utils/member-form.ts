import type { FieldErrors } from 'react-hook-form'

import type { MemberFormValues, MemberTab } from '@/modules/members/types/member'

export const isPrincipalComplete = (principal: MemberFormValues['principal']): boolean => {
  return (
    principal.firstName.trim() !== '' &&
    principal.lastName.trim() !== '' &&
    principal.address.trim() !== '' &&
    principal.birthday.trim() !== '' &&
    principal.civilStatus !== '' &&
    principal.weeklyContribution !== ''
  )
}

export const getFirstInvalidMemberTab = (errors: FieldErrors<MemberFormValues>): MemberTab => {
  if (errors.principal) {
    return 'principal'
  }

  if (errors.beneficiaries) {
    return 'beneficiaries'
  }

  if (errors.dependents) {
    return 'dependent'
  }

  return 'principal'
}
