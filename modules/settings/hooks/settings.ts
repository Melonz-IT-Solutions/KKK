'use client'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'

import { DEFAULT_ACCOUNT_INFO, DEFAULT_PASSWORD_INFO } from '@/modules/settings/data/settings'

import type { AccountInfo, PasswordInfo, SettingsSection } from '@/modules/settings/types/settings'

interface SaveResponse {
  message: string
}

export function useSettings() {
  const { data: session, status } = useSession()

  const [activeSection, setActiveSection] = useState<SettingsSection>('account')

  const [accountInfo, setAccountInfo] = useState<AccountInfo>(DEFAULT_ACCOUNT_INFO)

  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>(DEFAULT_PASSWORD_INFO)

  const [loading, setLoading] = useState(true)
  const [savingAccount, setSavingAccount] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    if (!session?.user) {
      setLoading(false)
      return
    }

    const loadAccount = async () => {
      try {
        setLoading(true)

        const response = await fetch('/api/settings/account', {
          method: 'GET',
          cache: 'no-store',
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load account information')
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

    loadAccount()
  }, [session, status])

  const updateAccountField = (field: keyof AccountInfo, value: string) => {
    setAccountInfo(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const updatePasswordField = (field: keyof PasswordInfo, value: string) => {
    setPasswordInfo(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveAccount = async (): Promise<SaveResponse> => {
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
        throw new Error(data.message || 'Failed to update account')
      }

      if (data.user) {
        setAccountInfo({
          firstName: data.user.name?.trim().split(/\s+/)[0] ?? '',
          middleName: '',
          lastName: '',
          email: data.user.email ?? '',
          contactNumber: data.user.contactNo ?? '',
        })
      }

      return {
        message: data.message || 'Account information updated successfully',
      }
    } finally {
      setSavingAccount(false)
    }
  }

  const savePassword = async (): Promise<SaveResponse> => {
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
        throw new Error(data.message || 'Failed to update password')
      }

      setPasswordInfo(DEFAULT_PASSWORD_INFO)

      return {
        message: data.message || 'Password updated successfully',
      }
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
  }
}
