// modules/members/schemas/member-schema.ts
import { z } from 'zod'

// ---------------------------------------------------------------------------
// Option value lists — adjust these to match your actual constants
// (CIVIL_STATUS_OPTIONS, GENDER_OPTIONS, RELATIONSHIP_OPTIONS, etc.)
// Kept as plain readonly string arrays (not z.enum) so field types stay
// `string` everywhere — this avoids the zodResolver/useForm<T> generic
// mismatch that happens when a field's type is a literal union that
// includes an empty-string default ("" | "single" | "married" | ...).
// ---------------------------------------------------------------------------

export const CIVIL_STATUS_VALUES = ['single', 'married', 'widowed', 'separated'] as const
export const GENDER_VALUES = ['male', 'female'] as const
export const RELATIONSHIP_VALUES = ['spouse', 'child', 'parent', 'sibling', 'other'] as const
export const WEEKLY_CONTRIBUTION_VALUES = ['100', '150', '200', '250'] as const

// ---------------------------------------------------------------------------
// Principal member
// ---------------------------------------------------------------------------

export const principalMemberSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  address: z.string().min(1, 'Address is required.'),
  birthday: z.string().min(1, 'Birthday is required.'),
  age: z.string().optional(), // derived, read-only — not user-entered
  civilStatus: z.string().min(1, 'Select a civil status.'),
  weeklyContribution: z.string().min(1, 'Select a weekly contribution.'),
})

// ---------------------------------------------------------------------------
// Beneficiary entry (used for both primary and secondary)
// ---------------------------------------------------------------------------

export const beneficiaryEntrySchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  address: z.string().min(1, 'Address is required.'),
  birthday: z.string().min(1, 'Birthday is required.'),
  age: z.string().optional(),
  gender: z.string().min(1, 'Select a gender.'),
  relationship: z.string().min(1, 'Select a relationship.'),
})

export const beneficiaryFormSchema = z.object({
  primary: beneficiaryEntrySchema,
  secondary: beneficiaryEntrySchema,
})

// ---------------------------------------------------------------------------
// Dependent entry (repeatable — array, min 1)
// ---------------------------------------------------------------------------

export const dependentEntrySchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  address: z.string().min(1, 'Address is required.'),
  birthday: z.string().min(1, 'Birthday is required.'),
  age: z.string().optional(),
  gender: z.string().min(1, 'Select a gender.'),
})

// ---------------------------------------------------------------------------
// Full form
// ---------------------------------------------------------------------------

export const memberFormSchema = z.object({
  principal: principalMemberSchema,
  beneficiaries: beneficiaryFormSchema,
  dependents: z.array(dependentEntrySchema).min(1, 'Add at least one dependent.'),
})

// Infer everything from the schema — do NOT hand-write a matching interface
// alongside it. That duplication is exactly what caused the resolver/useForm
// type mismatch: two independently-written types that were supposed to be
// identical but weren't, bit-for-bit, in TypeScript's eyes.
export type MemberFormValues = z.infer<typeof memberFormSchema>
export type PrincipalMemberFormValues = z.infer<typeof principalMemberSchema>
export type BeneficiaryEntryValues = z.infer<typeof beneficiaryEntrySchema>
export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>
export type DependentEntryValues = z.infer<typeof dependentEntrySchema>

// ---------------------------------------------------------------------------
// Default / empty values
// ---------------------------------------------------------------------------

export const emptyBeneficiaryEntry: BeneficiaryEntryValues = {
  name: '',
  address: '',
  birthday: '',
  age: '',
  gender: '',
  relationship: '',
}

export const emptyDependentEntry: DependentEntryValues = {
  name: '',
  address: '',
  birthday: '',
  age: '',
  gender: '',
}

export const defaultMemberFormValues: MemberFormValues = {
  principal: {
    name: '',
    address: '',
    birthday: '',
    age: '',
    civilStatus: '',
    weeklyContribution: '',
  },
  beneficiaries: {
    primary: { ...emptyBeneficiaryEntry },
    secondary: { ...emptyBeneficiaryEntry },
  },
  dependents: [{ ...emptyDependentEntry }],
}
