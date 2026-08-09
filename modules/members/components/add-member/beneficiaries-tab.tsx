// modules/members/components/add-member/beneficiaries-tab.tsx
import {
  type Control,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
} from 'react-hook-form'
import { BeneficiaryEntryFields } from '@/modules/members/components/add-member/beneficiary-entry-fields'
import type { MemberFormValues } from '@/modules/members/schema/member-schema'

interface BeneficiariesTabProps {
  control: Control<MemberFormValues>
  errors?: FieldErrors<MemberFormValues>['beneficiaries']
  watch: UseFormWatch<MemberFormValues>
  setValue: UseFormSetValue<MemberFormValues>
}

export function BeneficiariesTab({ control, errors, watch, setValue }: BeneficiariesTabProps) {
  return (
    <div className="grid gap-4 p-6">
      <BeneficiaryEntryFields
        idPrefix="primary"
        sectionLabel="Primary Beneficiary"
        name="beneficiaries.primary"
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      <div className="mt-2 border-t pt-4">
        <BeneficiaryEntryFields
          idPrefix="secondary"
          sectionLabel="Secondary Beneficiary"
          name="beneficiaries.secondary"
          control={control}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      </div>
    </div>
  )
}
