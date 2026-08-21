'use client'

import { useEffect, useState } from 'react'

import type { AccountInfo, PasswordInfo } from '@/types/accountfield'

type SettingsSection = 'account' | 'password'

export function useSettings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account')

  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contactNumber: '',
  })

  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(true)
  const [savingAccount, setSavingAccount] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const loadAccount = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/settings/account', {
        method: 'GET',
        cache: 'no-store',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to load account information')
      }

      setAccountInfo({
        firstName: data.firstName ?? '',
        middleName: data.middleName ?? '',
        lastName: data.lastName ?? '',
        email: data.email ?? '',
        contactNumber: data.contactNumber ?? '',
      })
    } catch (error) {
      console.error('Failed to load account information:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAccount()
  }, [])

  const updateAccountField = (field: keyof AccountInfo, value: string) => {
    setAccountInfo(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveAccount = async () => {
    setSavingAccount(true)

    try {
      const response = await fetch('/api/settings/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountInfo),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to update account')
      }

      return data
    } finally {
      setSavingAccount(false)
    }
  }

  const updatePasswordField = (field: keyof PasswordInfo, value: string) => {
    setPasswordInfo(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const savePassword = async () => {
    if (!passwordInfo.currentPassword) {
      throw new Error('Current password is required')
    }

    if (!passwordInfo.newPassword) {
      throw new Error('New password is required')
    }

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      throw new Error('New passwords do not match')
    }

    setSavingPassword(true)

    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordInfo),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to update password')
      }

      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      return data
    } finally {
      setSavingPassword(false)
    }
  }

  return {
    activeSection,
    setActiveSection,

    accountInfo,
    passwordInfo,

    loading,
    savingAccount,
    savingPassword,

    updateAccountField,
    updatePasswordField,

    saveAccount,
    savePassword,

    reloadAccount: loadAccount,
  }
}
