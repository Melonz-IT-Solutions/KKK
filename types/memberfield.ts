// ---------------------------------------------------------------------------
// Shared primitive types
// ---------------------------------------------------------------------------

export type CivilStatus = 'single' | 'married' | 'widowed' | 'separated' | 'divorce'
export type WeeklyContribution = '25' | '50'
export type Gender = 'male' | 'female'
export type Relationship = 'spouse' | 'child' | 'parent' | 'sibling' | 'other'

// ---------------------------------------------------------------------------
// Form value shapes
// ---------------------------------------------------------------------------

export interface PrincipalMemberFormValues {
  firstName: string
  middleName: string
  lastName: string
  address: string
  birthday: string
  age: string
  civilStatus: CivilStatus | ''
  weeklyContribution: WeeklyContribution | ''
}

export interface BeneficiaryEntryValues {
  name: string
  address: string
  birthday: string
  age: string
  gender: Gender | ''
  relationship: Relationship | ''
}

export interface BeneficiaryFormValues {
  primary: BeneficiaryEntryValues
  secondary: BeneficiaryEntryValues
}

export interface DependentEntryValues {
  name: string
  address: string
  birthday: string
  age: string
  gender: Gender | ''
}

// ---------------------------------------------------------------------------
// Component prop types
// ---------------------------------------------------------------------------

export interface MemberSubmissionPayload {
  principal: PrincipalMemberFormValues
  beneficiaries: BeneficiaryFormValues
  dependents: DependentEntryValues[]
}

export interface AddMemberSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (values: MemberSubmissionPayload) => void
  onSaveBeneficiary?: (values: BeneficiaryFormValues) => void
  onSaveDependents?: (values: DependentEntryValues[]) => void
}

export interface BeneficiaryEntryFieldsProps {
  idPrefix: string
  sectionLabel: string
  values: BeneficiaryEntryValues
  errors: Partial<Record<keyof BeneficiaryEntryValues, string>>
  onChange: <K extends keyof BeneficiaryEntryValues>(
    key: K,
    value: BeneficiaryEntryValues[K]
  ) => void
}

export interface DependentEntryFieldsProps {
  idPrefix: string
  index: number
  values: DependentEntryValues
  errors: Partial<Record<keyof DependentEntryValues, string>>
  onChange: <K extends keyof DependentEntryValues>(key: K, value: DependentEntryValues[K]) => void
  onRemove?: () => void
}
