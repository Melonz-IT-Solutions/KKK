import type { AccountInfo, StaffRole } from '@/types/accountfield'

export const SETTINGS_OPTIONS = [
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
] as const

export const ACCOUNT_FIELDS = [
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
] as const

export const DEFAULT_ROLES: StaffRole[] = ['SUPER_ADMIN', 'STAFF_USER']

export const DEFAULT_ACCOUNT_INFO: AccountInfo = {
  firstName: 'Super',
  lastName: 'Admin',
  email: 'super-admin@kkk.com',
  contactNumber: '454545454',
  middleName: '',
}
