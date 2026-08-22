import type { AccountInfo, PasswordInfo, SettingsSection } from '@/modules/settings/types/settings'

export const DEFAULT_ACCOUNT_INFO: AccountInfo = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  contactNumber: '',
}

export const DEFAULT_PASSWORD_INFO: PasswordInfo = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export const SETTINGS_OPTIONS: {
  id: SettingsSection
  title: string
  description: string
}[] = [
  {
    id: 'account',
    title: 'Account info',
    description: 'Personal profile details.',
  },
  {
    id: 'password',
    title: 'Change password',
    description: 'Update your security credentials.',
  },
]

export const ACCOUNT_FIELDS: {
  key: keyof AccountInfo
  label: string
}[] = [
  {
    key: 'firstName',
    label: 'First Name',
  },
  {
    key: 'middleName',
    label: 'Middle Name',
  },
  {
    key: 'lastName',
    label: 'Last Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'contactNumber',
    label: 'Mobile Number',
  },
]

export const PASSWORD_FIELDS: {
  key: keyof PasswordInfo
  label: string
  placeholder: string
}[] = [
  {
    key: 'currentPassword',
    label: 'Current Password',
    placeholder: '**********',
  },
  {
    key: 'newPassword',
    label: 'New Password',
    placeholder: '**********',
  },
  {
    key: 'confirmPassword',
    label: 'Confirm New Password',
    placeholder: '**********',
  },
]
