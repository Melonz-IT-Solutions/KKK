import type { StaffRole } from '@/types/accountfield'

export type SettingsSection = 'account' | 'password' | 'roles'

export interface AccountInfo {
  firstName: string
  middleName: string
  lastName: string
  userName: string
  email: string
  contactNumber: string
}

export interface PasswordInfo {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface InfoFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  options?: string[]
}

export interface AccountSectionProps {
  accountInfo: AccountInfo
  updateField: (field: keyof AccountInfo, value: string) => void
  onSave: () => void
  saving: boolean
}

export interface PasswordSectionProps {
  passwordInfo: PasswordInfo
  updateField: (field: keyof PasswordInfo, value: string) => void
  onSubmit: () => void
  saving: boolean
}

export interface SettingsOption {
  id: SettingsSection
  title: string
  description: string
  superAdminOnly?: boolean
}

export interface SettingsSidebarProps {
  activeSection: SettingsSection
  setActiveSection: (section: SettingsSection) => void
  options: SettingsOption[]
}

export interface SettingsAccountResponse {
  accountInfo: AccountInfo
  roles: StaffRole
}
