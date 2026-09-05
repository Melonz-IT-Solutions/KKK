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

export const emptyForm: StaffFormValues = {
  username: '',
  department: '',
  role: '',
  branch: '',
  cluster: '',
  email: '',
  firstName: '',
  lastName: '',
  clientId: '',
  password: '',
  confirmPassword: '',
}
