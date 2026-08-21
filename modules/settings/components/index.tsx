'use client'
import PageHeader from '@/components/headers/page-header'
import SettingsSidebar from './settings-sidebar'
import AccountSection from './account/account-section'
import PasswordSection from './password/password-section'

import { useSettings } from '@/hooks/useSettings'

import { showErrorToast, showSuccessToast } from '@/lib/toast-messagealert/showSuccessToast'

export default function SettingsPageView() {
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
          <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

          <div>
            {activeSection === 'account' ? (
              <AccountSection
                accountInfo={accountInfo}
                updateField={updateAccountField}
                onSave={handleAccountSave}
                saving={savingAccount}
              />
            ) : (
              <PasswordSection
                passwordInfo={passwordInfo}
                updateField={updatePasswordField}
                onSubmit={handlePasswordSave}
                saving={savingPassword}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
