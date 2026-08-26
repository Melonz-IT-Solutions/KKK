'use client'

import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from 'react-hook-form'

import { Plus } from 'lucide-react'

import Button from '@/components/button-v2/button'

import { DependentEntryFields } from '@/modules/members/components/add-member/dependent-entry-fields'

import { EMPTY_DEPENDENT_ENTRY } from '@/modules/members/data/member-form'

import type { MemberFormValues } from '@/modules/members/types/member'

interface DependentTabProps {
  control: Control<MemberFormValues>
  errors?: FieldErrors<MemberFormValues>['dependents']
  watch: UseFormWatch<MemberFormValues>
  setValue: UseFormSetValue<MemberFormValues>
}

export function DependentTab({ control, errors, watch, setValue }: DependentTabProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dependents',
  })

  const addDependent = () => {
    append({
      ...EMPTY_DEPENDENT_ENTRY,
    })
  }

  return (
    <div className="grid gap-4 p-6">
      {fields.map((field, index) => (
        <DependentEntryFields
          key={field.id}
          index={index}
          control={control}
          errors={errors}
          watch={watch}
          setValue={setValue}
          onRemove={fields.length > 1 ? () => remove(index) : undefined}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full justify-center gap-2 rounded-sm border-gray-300 bg-white text-black hover:bg-gray-50"
        onClick={addDependent}
      >
        <Plus className="h-4 w-4" />
        Add Dependent
      </Button>
    </div>
  )
}
