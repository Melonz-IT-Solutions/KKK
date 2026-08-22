import type { AccountInfo, PasswordInfo } from '@/modules/settings/types/settings'

export function getFullName(accountInfo: AccountInfo): string {
  return [accountInfo.firstName, accountInfo.middleName, accountInfo.lastName]
    .map(value => value.trim())
    .filter(Boolean)
    .join(' ')
}

export function isAccountInfoChanged(current: AccountInfo, original: AccountInfo): boolean {
  return (
    current.firstName !== original.firstName ||
    current.middleName !== original.middleName ||
    current.lastName !== original.lastName ||
    current.email !== original.email ||
    current.contactNumber !== original.contactNumber
  )
}

export function isPasswordComplete(passwordInfo: PasswordInfo): boolean {
  return Boolean(
    passwordInfo.currentPassword && passwordInfo.newPassword && passwordInfo.confirmPassword
  )
}

export function clearPasswordInfo(): PasswordInfo {
  return {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}
