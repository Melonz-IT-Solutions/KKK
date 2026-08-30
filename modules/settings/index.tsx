'use client'

import { useRoleStore } from '@/lib/stores/role-store'

import PageHeader from '@/components/headers/page-header'

import SettingsSidebar from './components/settings-sidebar'
import AccountSection from './components/account/account-section'
import PasswordSection from './components/password/password-section'
import RolesSection from './components/roles/roles-section'

import { useSettings } from '@/modules/settings/hooks/settings'
import { SETTINGS_OPTIONS } from '@/modules/settings/data/settings'

import { showErrorToast, showSuccessToast } from '@/lib/toast-messagealert/showSuccessToast'

export default function SettingsPageView() {
  const { activeRole, realRole } = useRoleStore()
  const isSuperAdmin = realRole === 'SUPER_ADMIN' && activeRole === 'SUPER_ADMIN'

  const visibleOptions = SETTINGS_OPTIONS.filter(opt => !opt.superAdminOnly || isSuperAdmin)

  const {
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
  } = useSettings()

  const handleAccountSave = async () => {
    try {
      const result = await saveAccount()

      showSuccessToast(result.message)
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to update account')
    }
  }

  const handlePasswordSave = async () => {
    try {
      const result = await savePassword()

      showSuccessToast(result.message)
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to update password')
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account details, security preferences, and system access."
      />

      {loading ? (
        <div className="p-6">
          <p className="text-muted-foreground text-sm">Loading account information...</p>
        </div>
      ) : (
        <div className="grid gap-6 p-6 md:grid-cols-[300px_1fr] lg:grid-cols-[280px_minmax(0,1fr)]">
          <SettingsSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            options={visibleOptions}
          />

          <div>
            {activeSection === 'account' ? (
              <AccountSection
                accountInfo={accountInfo}
                updateField={updateAccountField}
                onSave={handleAccountSave}
                saving={savingAccount}
              />
            ) : activeSection === 'password' ? (
              <PasswordSection
                passwordInfo={passwordInfo}
                updateField={updatePasswordField}
                onSubmit={handlePasswordSave}
                saving={savingPassword}
              />
            ) : isSuperAdmin ? (
              <RolesSection />
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}
