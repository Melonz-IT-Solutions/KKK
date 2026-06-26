'use client'

import { useState } from 'react'
import {
  DEFAULT_ROLES,
  DEFAULT_ACCOUNT_INFO,
  DEFAULT_ACCOUNT_STATUS,
} from '@/lib/data/settings.data'
import { AccountInfo, AccountStatus } from '@/types/settings'

export function useSettings() {
  const [activeSection, setActiveSection] =
    useState<'account' | 'password'>('account')

  const [roles, setRoles] = useState(DEFAULT_ROLES)

  const [accountInfo, setAccountInfo] =
    useState<AccountInfo>(DEFAULT_ACCOUNT_INFO)

  const [accountStatus, setAccountStatus] =
    useState<AccountStatus>(DEFAULT_ACCOUNT_STATUS)

  const removeRole = (roleToRemove: string) => {
    setRoles((prev) =>
      prev.filter((role) => role !== roleToRemove)
    )
  }

  const addRole = (role: string) => {
    setRoles((prev) => [...prev, role])
  }

  const updateField = (
    field: keyof AccountInfo,
    value: string
  ) => {
    setAccountInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleAccountStatus = () => {
    setAccountStatus((prev) =>
      prev === 'active' ? 'deactivated' : 'active'
    )
  }

  return {
    activeSection,
    setActiveSection,
    roles,
    accountInfo,
    accountStatus,
    removeRole,
    addRole,
    updateField,
    toggleAccountStatus,
  }
}