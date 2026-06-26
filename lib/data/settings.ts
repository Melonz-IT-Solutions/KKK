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
] as const;

export const ACCOUNT_FIELDS = [
  {
    key: 'fullName',
    label: 'Full Name',
  },
  {
    key: 'username',
    label: 'Username',
  },
  {
    key: 'department',
    label: 'Department',
  },
  {
    key: 'contactNumber',
    label: 'Contact Number',
  },
] as const;
