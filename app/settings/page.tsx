'use client'

import SettingsSidebar from '@/components/settings/settings-sidebar'
import AccountSection from '@/components/settings/account-section'
import PasswordSection from '@/components/settings/password-section'
import { useSettings } from '@/hooks/useSettings'

export default function SettingsPage() {
  const {
    activeSection,
    setActiveSection,
    roles,
    accountInfo,
    accountStatus,
    removeRole,
    addRole,
    updateField,
    toggleAccountStatus,
  } = useSettings()

  return (
    <>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account details, security preferences, and system access.
        </p>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-[300px_1fr]">
        <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        <div className="grid md:grid-cols-[1000px_1fr]">
          {activeSection === 'account' ? (
            <AccountSection
              roles={roles}
              removeRole={removeRole}
              accountInfo={accountInfo}
              updateField={updateField}
              accountStatus={accountStatus}
              toggleAccountStatus={toggleAccountStatus}
              addRole={addRole}
            />
          ) : (
            <PasswordSection />
          )}
        </div>
      </div>
    </>
  )
}
