'use client'

import { useEffect, useState } from 'react'

import type { MemberProfile } from '@/modules/members/types/member-profile'

export function useEditMemberProfile(profile: MemberProfile) {
  const [formState, setFormState] = useState<MemberProfile>(profile)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFormState(profile)
  }, [profile])

  function updatePrincipal<K extends keyof MemberProfile['principal']>(
    key: K,
    value: MemberProfile['principal'][K]
  ) {
    setFormState(prev => ({
      ...prev,
      principal: {
        ...prev.principal,
        [key]: value,
      },
    }))
  }

  function updateBeneficiary(
    role: 'primary' | 'secondary',
    key: 'name' | 'address' | 'birthday' | 'gender' | 'relationship',
    value: string
  ) {
    setFormState(prev => ({
      ...prev,
      beneficiaries: {
        ...prev.beneficiaries,
        [role]: {
          ...(prev.beneficiaries[role] ?? {
            name: '',
            address: '',
            birthday: '',
            gender: '',
            relationship: '',
          }),
          [key]: value,
        },
      },
    }))
  }

  function updateDependent(
    index: number,
    key: 'name' | 'address' | 'birthday' | 'gender',
    value: string
  ) {
    setFormState(prev => ({
      ...prev,
      dependents: prev.dependents.map((dependent, i) =>
        i === index
          ? {
              ...dependent,
              [key]: value,
            }
          : dependent
      ),
    }))
  }

  async function save() {
    setSaving(true)

    try {
      const response = await fetch(`/api/members/${formState.principal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message ?? 'Failed to update member profile')
      }

      return result
    } finally {
      setSaving(false)
    }
  }

  return {
    formState,
    saving,
    updatePrincipal,
    updateBeneficiary,
    updateDependent,
    save,
  }
}
