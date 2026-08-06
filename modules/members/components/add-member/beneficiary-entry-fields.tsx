import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import Input from '@/components/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GENDER_OPTIONS, RELATIONSHIP_OPTIONS } from '@/modules/members/constants/members'
import type { MemberFormValues } from '@/modules/members/schema/member-schema'
import { useComputedAge } from '@/modules/members/hooks/use-computed-age'
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form'

interface BeneficiaryEntryFieldsProps {
  idPrefix: string
  sectionLabel: string
  name: 'beneficiaries.primary' | 'beneficiaries.secondary'
  control: Control<MemberFormValues>
  errors?: FieldErrors<MemberFormValues>['beneficiaries']
  watch: UseFormWatch<MemberFormValues>
  setValue: UseFormSetValue<MemberFormValues>
}

export function BeneficiaryEntryFields({
  idPrefix,
  sectionLabel,
  name,
  control,
  errors,
  watch,
  setValue,
}: BeneficiaryEntryFieldsProps) {
  const which = name.split('.')[1] as 'primary' | 'secondary'
  const entryErrors = errors?.[which]

  useComputedAge(watch, setValue, `${name}.birthday`, `${name}.age`)

  return (
    <div className="grid gap-3">
      <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {sectionLabel}
      </p>

      {/* Name */}
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>
        <Controller
          control={control}
          name={`${name}.name`}
          render={({ field }) => (
            <Input
              id={`${idPrefix}-name`}
              placeholder="Full name"
              {...field}
              aria-invalid={!!entryErrors?.name}
            />
          )}
        />
        {entryErrors?.name && (
          <p className="text-destructive text-sm">{entryErrors.name.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-address`}>Address</Label>
        <Controller
          control={control}
          name={`${name}.address`}
          render={({ field }) => (
            <Input
              id={`${idPrefix}-address`}
              placeholder="Complete Address"
              {...field}
              aria-invalid={!!entryErrors?.address}
            />
          )}
        />
        {entryErrors?.address && (
          <p className="text-destructive text-sm">{entryErrors.address.message}</p>
        )}
      </div>

      {/* Birthday + Age */}
      <div className="flex justify-items-center gap-2">
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-birthday`}>Birthday</Label>
          <Controller
            control={control}
            name={`${name}.birthday`}
            render={({ field }) => (
              <Input
                id={`${idPrefix}-birthday`}
                type="date"
                {...field}
                aria-invalid={!!entryErrors?.birthday}
              />
            )}
          />
          {entryErrors?.birthday && (
            <p className="text-destructive text-sm">{entryErrors.birthday.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-age`}>Age</Label>
          <Controller
            control={control}
            name={`${name}.age`}
            render={({ field }) => (
              <Input id={`${idPrefix}-age`} {...field} readOnly placeholder="" />
            )}
          />
        </div>
      </div>

      {/* Gender + Relationship */}
      <div className="flex gap-2">
        <div className="grid w-full gap-2">
          <Label htmlFor={`${idPrefix}-gender`}>Gender</Label>
          <Controller
            control={control}
            name={`${name}.gender`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={`${idPrefix}-gender`}
                  aria-invalid={!!entryErrors?.gender}
                  className="w-full"
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {entryErrors?.gender && (
            <p className="text-destructive text-sm">{entryErrors.gender.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-relationship`}>Relationship</Label>
          <Controller
            control={control}
            name={`${name}.relationship`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={`${idPrefix}-relationship`}
                  aria-invalid={!!entryErrors?.relationship}
                  className="w-full"
                >
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {entryErrors?.relationship && (
            <p className="text-destructive text-sm">{entryErrors.relationship.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
