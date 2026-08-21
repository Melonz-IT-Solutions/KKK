import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from 'react-hook-form'

import { X } from 'lucide-react'

import Input from '@/components/input'
import { Label } from '@/components/ui/label'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { GENDER_OPTIONS } from '@/modules/members/constants/member-form'

import type { MemberFormValues } from '@/modules/members/types/member'

import { useComputedAge } from '@/modules/members/hooks/use-computed-age'

interface DependentEntryFieldsProps {
  index: number
  control: Control<MemberFormValues>
  errors?: FieldErrors<MemberFormValues>['dependents']
  watch: UseFormWatch<MemberFormValues>
  setValue: UseFormSetValue<MemberFormValues>
  onRemove?: () => void
}

export function DependentEntryFields({
  index,
  control,
  errors,
  watch,
  setValue,
  onRemove,
}: DependentEntryFieldsProps) {
  const idPrefix = `dependent-${index}`

  const entryErrors = errors?.[index]

  const birthdayPath = `dependents.${index}.birthday` as const
  const agePath = `dependents.${index}.age` as const

  useComputedAge(watch, setValue, birthdayPath, agePath)

  return (
    <div className="relative grid gap-4 rounded-md border p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Dependent {index + 1}
        </p>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove dependent ${index + 1}`}
            className="rounded-sm p-1 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Name */}
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>

        <Controller
          control={control}
          name={`dependents.${index}.name`}
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
          name={`dependents.${index}.address`}
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
      <div className="grid grid-cols-[1fr_100px] items-end gap-4">
        {/* Birthday */}
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-birthday`}>Birthday</Label>

          <Controller
            control={control}
            name={`dependents.${index}.birthday`}
            render={({ field }) => (
              <Input
                id={`${idPrefix}-birthday`}
                type="date"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={!!entryErrors?.birthday}
              />
            )}
          />

          {entryErrors?.birthday && (
            <p className="text-destructive text-sm">{entryErrors.birthday.message}</p>
          )}
        </div>

        {/* Age */}
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-age`}>Age</Label>

          <Controller
            control={control}
            name={`dependents.${index}.age`}
            render={({ field }) => (
              <Input
                id={`${idPrefix}-age`}
                value={field.value ?? ''}
                readOnly
                tabIndex={-1}
                placeholder="Age"
              />
            )}
          />
        </div>
      </div>

      {/* Gender */}
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-gender`}>Gender</Label>

        <Controller
          control={control}
          name={`dependents.${index}.gender`}
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
    </div>
  )
}
