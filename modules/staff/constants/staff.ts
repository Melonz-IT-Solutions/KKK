// modules/staff/constants/staff.ts
import type { Department, StaffFormValues } from '../types/staff'

export const DEPARTMENT_OPTIONS: { value: Department; label: string }[] = [
  { value: 'finance', label: 'Finance' },
  { value: 'mis', label: 'MIS' },
]

export const emptyForm: StaffFormValues = {
  department: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}
