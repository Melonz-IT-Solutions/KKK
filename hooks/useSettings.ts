'use client'

import { useState } from 'react'

import { DEFAULT_ROLES, DEFAULT_ACCOUNT_INFO } from '@/lib/data/settings.data'

import { AccountInfo, StaffRole } from '@/types/accountfield'

export function useSettings() {
  const [activeSection, setActiveSection] = useState<'account' | 'password'>('account')

  const [roles, setRoles] = useState(DEFAULT_ROLES)

  const [accountInfo, setAccountInfo] = useState<AccountInfo>(DEFAULT_ACCOUNT_INFO)

  const removeRole = (roleToRemove: StaffRole) => {
    setRoles(prev => prev.filter(role => role !== roleToRemove))
  }

  const addRole = (role: StaffRole) => {
    setRoles(prev => [...prev, role])
  }

  const updateField = (field: keyof AccountInfo, value: string) => {
    setAccountInfo(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return {
    activeSection,
    setActiveSection,

    roles,

    accountInfo,

    addRole,
    removeRole,

    updateField,
  }
}
