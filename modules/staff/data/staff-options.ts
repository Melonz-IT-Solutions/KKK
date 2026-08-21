import type { Department, StaffFormValues } from '@/modules/staff/types/staff'

export const DEPARTMENT_OPTIONS: {
  label: string
  value: Department
}[] = [
  {
    label: 'Finance',
    value: 'Finance',
  },
  {
    label: 'Branch Management',
    value: 'Branch Management',
  },
  {
    label: 'General Staff',
    value: 'General Staff',
  },
]

export const ROLE_OPTIONS = [
  {
    label: 'Finance',
    value: 'FINANCE',
  },
  {
    label: 'Branch Manager',
    value: 'BRANCH_MANAGER',
  },
  {
    label: 'Staff',
    value: 'STAFF',
  },
] as const

export const DEPARTMENT_ROLE_MAP = {
  Finance: 'FINANCE',
  'Branch Management': 'BRANCH_MANAGER',
  'General Staff': 'STAFF',
} as const

export const EMPTY_STAFF_FORM: StaffFormValues = {
  username: '',
  department: '',
  role: '',
  branch: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}
