'use client'

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from 'react-hook-form'

import Input from '@/components/input'

import { Label } from '@/components/ui/label'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { GENDER_OPTIONS, RELATIONSHIP_OPTIONS } from '@/modules/members/data/member-form'

import type { MemberFormValues } from '@/modules/members/types/member'

import { useComputedAge } from '@/modules/members/hooks/use-computed-age'

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
  const beneficiaryType = name.split('.')[1] as 'primary' | 'secondary'

  const entryErrors = errors?.[beneficiaryType]

  useComputedAge(watch, setValue, `${name}.birthday`, `${name}.age`)

  return (
    <div className="grid gap-2">
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
              value={field.value ?? ''}
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
              value={field.value ?? ''}
              aria-invalid={!!entryErrors?.address}
            />
          )}
        />

        {entryErrors?.address && (
          <p className="text-destructive text-sm">{entryErrors.address.message}</p>
        )}
      </div>

      {/* Birthday + Age */}
      <div className="grid grid-cols-2 gap-2">
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
                value={field.value ?? ''}
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
              <Input id={`${idPrefix}-age`} {...field} value={field.value ?? ''} readOnly />
            )}
          />
        </div>
      </div>

      {/* Gender + Relationship */}
      <div className="grid grid-cols-2 gap-2">
        {/* Gender */}
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-gender`}>Gender</Label>

          <Controller
            control={control}
            name={`${name}.gender`}
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger
                  id={`${idPrefix}-gender`}
                  className="w-full"
                  aria-invalid={!!entryErrors?.gender}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>

                <SelectContent>
                  {GENDER_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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

        {/* Relationship */}
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-relationship`}>Relationship</Label>

          <Controller
            control={control}
            name={`${name}.relationship`}
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger
                  id={`${idPrefix}-relationship`}
                  className="w-full"
                  aria-invalid={!!entryErrors?.relationship}
                >
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>

                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
