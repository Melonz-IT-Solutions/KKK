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
import { X } from 'lucide-react'
import { GENDER_OPTIONS } from '@/modules/members/constants/members'
import type { MemberFormValues } from '@/modules/members/schema/member-schema'
import { useComputedAge } from '@/modules/members/hooks/use-computed-age'
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form'

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

  useComputedAge(watch, setValue, `dependents.${index}.birthday`, `dependents.${index}.age`)

  return (
    <div className="relative grid gap-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Dependent {index + 1}
        </p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove dependent ${index + 1}`}
            className="hover:*:text-destructive"
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
      <div className="flex gap-2">
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-birthday`}>Birthday</Label>
          <Controller
            control={control}
            name={`dependents.${index}.birthday`}
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
            name={`dependents.${index}.age`}
            render={({ field }) => (
              <Input id={`${idPrefix}-age`} {...field} readOnly placeholder="" />
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
    </div>
  )
}
