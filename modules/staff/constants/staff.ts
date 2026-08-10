import type { Department, StaffFormValues } from '../types/staff'

export const DEPARTMENT_OPTIONS: { value: Department; label: string }[] = [
  { value: 'finance', label: 'Finance' },
  { value: 'mis', label: 'MIS' },
]

export const emptyForm: StaffFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  department: '',
  role: 'STAFF',
}

export const DEFAULT_STAFF_FORM_VALUES = emptyForm
