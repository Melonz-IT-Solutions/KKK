import { z } from 'zod'

export const civilStatusSchema = z.string().min(1, 'Select a civil status.')

export const genderSchema = z.string().min(1, 'Select a gender.')

export const relationshipSchema = z.string().min(1, 'Select a relationship.')

export const weeklyContributionSchema = z.string().min(1, 'Select a weekly contribution.')

export const principalMemberSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),

  middleName: z.string(),

  lastName: z.string().min(1, 'Last name is required.'),

  branch: z.string().min(1, 'Branch is required.'),

  address: z.string().min(1, 'Address is required.'),

  birthday: z.string().min(1, 'Birthday is required.'),

  age: z.string().optional(),

  civilStatus: civilStatusSchema,

  weeklyContribution: weeklyContributionSchema,
})

export const beneficiaryEntrySchema = z.object({
  name: z.string(),
  address: z.string(),
  birthday: z.string(),
  age: z.string(),
  gender: z.string(),
  relationship: z.string(),
})

export const beneficiaryFormSchema = z.object({
  primary: beneficiaryEntrySchema,
  secondary: beneficiaryEntrySchema,
})

export const dependentEntrySchema = z.object({
  name: z.string(),
  address: z.string(),
  birthday: z.string(),
  age: z.string(),
  gender: z.string(),
})

export const memberFormSchema = z.object({
  principal: principalMemberSchema,
  beneficiaries: beneficiaryFormSchema,
  dependents: z.array(dependentEntrySchema),
})

export const addMemberSchema = memberFormSchema
