'use client'

import { useState } from 'react'

import SettingsSidebar from '@/modules/settings/components/settings-sidebar'
import AccountSection from '@/modules/settings/components/account-section'
import PasswordSection from '@/modules/settings/components/password-section'
import PageHeader from '@/components/headers/page-header'

import { useSettings } from '@/hooks/useSettings'
import type { PasswordInfo } from '@/types/accountfield'

export default function SettingsPageView() {
  const { activeSection, setActiveSection, roles, accountInfo, removeRole, addRole, updateField } =
    useSettings()

  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const updatePasswordField = (field: keyof PasswordInfo, value: string) => {
    setPasswordInfo(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePasswordSubmit = () => {
    console.log(passwordInfo)

    // TODO:
    // call API
    // validate passwords
    // show toast
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account details, security preferences, and system access."
      />

      <div className="grid gap-6 p-6 md:grid-cols-[300px_1fr] lg:grid-cols-[280px_minmax(0,1fr)]">
        <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        <div className=" ">
          {activeSection === 'account' ? (
            <AccountSection
              roles={roles}
              removeRole={removeRole}
              addRole={addRole}
              accountInfo={accountInfo}
              updateField={updateField}
            />
          ) : (
            <PasswordSection
              passwordInfo={passwordInfo}
              updateField={updatePasswordField}
              onSubmit={handlePasswordSubmit}
            />
          )}
        </div>
      </div>
    </>
  )
}
