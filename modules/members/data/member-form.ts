import type {
  BeneficiaryEntryValues,
  DependentEntryValues,
  MemberFormValues,
} from '@/modules/members/types/member'

// ---------------------------------------------------------------------------
// Option values
// ---------------------------------------------------------------------------

export const CIVIL_STATUS_VALUES = ['single', 'married', 'widowed', 'separated'] as const

export const GENDER_VALUES = ['male', 'female'] as const

export const RELATIONSHIP_VALUES = ['spouse', 'child', 'parent', 'sibling', 'other'] as const

export const WEEKLY_CONTRIBUTION_VALUES = ['25', '50'] as const

// ---------------------------------------------------------------------------
// Select options
// ---------------------------------------------------------------------------

export const CIVIL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
] as const

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
] as const

export const RELATIONSHIP_OPTIONS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other', label: 'Other' },
] as const

export const WEEKLY_CONTRIBUTION_OPTIONS = [
  { value: '25', label: '25' },
  { value: '50', label: '50' },
] as const

// ---------------------------------------------------------------------------
// Empty beneficiary
// ---------------------------------------------------------------------------

export const EMPTY_BENEFICIARY_ENTRY: BeneficiaryEntryValues = {
  name: '',
  address: '',
  birthday: '',
  age: '',
  gender: '',
  relationship: '',
}

// ---------------------------------------------------------------------------
// Empty dependent
// ---------------------------------------------------------------------------

export const EMPTY_DEPENDENT_ENTRY: DependentEntryValues = {
  name: '',
  address: '',
  birthday: '',
  age: '',
  gender: '',
}

export const DEFAULT_MEMBER_FORM_VALUES: MemberFormValues = {
  principal: {
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    birthday: '',
    age: '',
    civilStatus: '',
    weeklyContribution: '',
  },

  beneficiaries: {
    primary: {
      ...EMPTY_BENEFICIARY_ENTRY,
    },

    secondary: {
      ...EMPTY_BENEFICIARY_ENTRY,
    },
  },

  dependents: [],
}

// ---------------------------------------------------------------------------
// Backward-compatible alias
// ---------------------------------------------------------------------------

export const defaultMemberFormValues = DEFAULT_MEMBER_FORM_VALUES
