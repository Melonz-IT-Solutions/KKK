import type { DragEvent } from 'react'
import type { z } from 'zod'

import type { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import {
  addMemberSchema,
  beneficiaryEntrySchema,
  beneficiaryFormSchema,
  dependentEntrySchema,
  memberFormSchema,
  principalMemberSchema,
} from '@/modules/members/schema/member-form'

// ---------------------------------------------------------------------------
// Member table
// ---------------------------------------------------------------------------

export interface MemberRow {
  id: number
  firstName: string
  middleName: string | null
  lastName: string
  membership: string
  age: number
  address: string
  branch: string | null
  civilStatus: string | null
}

export interface MemberColumn {
  key: string
  label: string
}

export interface MemberV2TableProps {
  data: MemberRow[]
  loading?: boolean
  onDeleted: () => Promise<void>
  onEdit: (memberId: number) => void
}

export interface RowMenuProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export interface BranchOption {
  label: string
  value: string
}

// ---------------------------------------------------------------------------
// Member filters
// ---------------------------------------------------------------------------

export type StatusFilter = 'active' | 'inactive' | 'all'

// ---------------------------------------------------------------------------
// Add member form types
// ---------------------------------------------------------------------------

export type MemberFormValues = z.infer<typeof memberFormSchema>

export type AddMemberValues = z.infer<typeof addMemberSchema>

export type PrincipalMemberFormValues = z.infer<typeof principalMemberSchema>

export type BeneficiaryEntryValues = z.infer<typeof beneficiaryEntrySchema>

export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>

export type DependentEntryValues = z.infer<typeof dependentEntrySchema>

// ---------------------------------------------------------------------------
// Add member tabs
// ---------------------------------------------------------------------------

export type MemberTab = 'principal' | 'beneficiaries' | 'dependent'

// ---------------------------------------------------------------------------
// Add member sheet
// ---------------------------------------------------------------------------

export interface AddMemberSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (payload: MemberFormValues) => void | Promise<void>
}

// ---------------------------------------------------------------------------
// Principal fields
// ---------------------------------------------------------------------------

export interface PrincipalMemberFieldsProps {
  control: Control<MemberFormValues>
  errors: FieldErrors<MemberFormValues['principal']>
  watch: UseFormWatch<MemberFormValues>
  setValue: UseFormSetValue<MemberFormValues>
}

// ---------------------------------------------------------------------------
// Beneficiaries
// ---------------------------------------------------------------------------

export interface BeneficiariesTabProps {
  control: Control<MemberFormValues>
  errors: FieldErrors<MemberFormValues['beneficiaries']>
  watch: UseFormWatch<MemberFormValues>
  setValue: UseFormSetValue<MemberFormValues>
}

// ---------------------------------------------------------------------------
// Dependents
// ---------------------------------------------------------------------------

export interface DependentTabProps {
  control: Control<MemberFormValues>
  errors: FieldErrors<MemberFormValues['dependents']>
  watch: UseFormWatch<MemberFormValues>
  setValue: UseFormSetValue<MemberFormValues>
}

export interface DropzoneFileInputProps {
  file: File | null
  isDragging: boolean
  onDragOver: (e: DragEvent<HTMLLabelElement>) => void
  onDragLeave: () => void
  onDrop: (e: DragEvent<HTMLLabelElement>) => void
  onFilesSelected: (fileList?: FileList | null) => void
}

export interface ImportMemberSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported?: () => void
}
