import type {
  PrincipalMemberFormValues,
  BeneficiaryEntryValues,
  BeneficiaryFormValues,
  DependentEntryValues,
  CivilStatus,
  WeeklyContribution,
  Gender,
  Relationship,
} from '@/types/memberfield';

// ---------------------------------------------------------------------------
// Empty/default form states
// ---------------------------------------------------------------------------

export const emptyForm: PrincipalMemberFormValues = {
  name: '',
  address: '',
  birthday: '',
  age: '',
  civilStatus: '',
  weeklyContribution: '',
};

export const emptyBeneficiaryEntry: BeneficiaryEntryValues = {
  name: '',
  address: '',
  birthday: '',
  age: '',
  gender: '',
  relationship: '',
};

export const emptyBeneficiaryForm: BeneficiaryFormValues = {
  primary: { ...emptyBeneficiaryEntry },
  secondary: { ...emptyBeneficiaryEntry },
};

export const emptyDependentEntry: DependentEntryValues = {
  name: '',
  address: '',
  birthday: '',
  age: '',
  gender: '',
};

// ---------------------------------------------------------------------------
// Select option lists
// ---------------------------------------------------------------------------

export const CIVIL_STATUS_OPTIONS: { value: CivilStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
  { value: 'divorce', label: 'Divorce' },
];

export const WEEKLY_CONTRIBUTION_OPTIONS: {
  value: WeeklyContribution;
  label: string;
}[] = [
  { value: '25', label: '25.00' },
  { value: '50', label: '50.00' },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other', label: 'Other' },
];

// constants/members.ts
import type {
  MemberColumn,
  BranchOption,
} from '@/modules/members/types/member';

// ...your existing CIVIL_STATUS_OPTIONS, GENDER_OPTIONS,
// WEEKLY_CONTRIBUTION_OPTIONS, RELATIONSHIP_OPTIONS, emptyForm, etc. stay here

export const MEMBER_TABLE_COLUMNS: MemberColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'membership', label: 'Membership' },
  { key: 'age', label: 'Age' },
  { key: 'address', label: 'Address' },
  { key: 'status', label: 'Civil Status' },
];

export const BRANCH_OPTIONS: BranchOption[] = [
  { label: 'Filter by Cluster / Branch', value: 'all' },
  { label: 'Talon-Talon Branch', value: 'talon-talon' },
  { label: 'Sta. Catalina Branch', value: 'sta. catalina' },
  { label: 'Tetuan Branch', value: 'tetuan' },
  { label: 'Putik Branch', value: 'putik' },
  { label: 'Mercedes Branch', value: 'mercedes' },
  { label: 'Sangali Branch', value: 'sangali' },
  { label: 'Cabaluay Branch', value: 'cabaluay' },
];
