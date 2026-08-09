// modules/members/components/add-member/principal-member-fields.tsx
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
import {
  CIVIL_STATUS_OPTIONS,
  WEEKLY_CONTRIBUTION_OPTIONS,
} from '@/modules/members/constants/members'
import type { MemberFormValues } from '@/modules/members/schema/member-schema'
import { useComputedAge } from '@/modules/members/hooks/use-computed-age'
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form'

interface PrincipalMemberFieldsProps {
  control: Control<MemberFormValues>
  errors?: FieldErrors<MemberFormValues>['principal']
  watch: UseFormWatch<MemberFormValues>
  setValue: UseFormSetValue<MemberFormValues>
}

export function PrincipalMemberFields({
  control,
  errors,
  watch,
  setValue,
}: PrincipalMemberFieldsProps) {
  useComputedAge(watch, setValue, 'principal.birthday', 'principal.age')

  return (
    <div className="grid gap-4 p-6">
      {/* Name */}
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Controller
          control={control}
          name="principal.name"
          render={({ field }) => (
            <Input id="name" placeholder="Full name" {...field} aria-invalid={!!errors?.name} />
          )}
        />
        {errors?.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>

      {/* Address */}
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Controller
          control={control}
          name="principal.address"
          render={({ field }) => (
            <Input
              id="address"
              placeholder="Complete Address"
              {...field}
              aria-invalid={!!errors?.address}
            />
          )}
        />
        {errors?.address && <p className="text-destructive text-sm">{errors.address.message}</p>}
      </div>

      {/* Birthday + Age */}
      <div className="flex justify-items-center gap-2">
        <div className="grid gap-2">
          <Label htmlFor="birthday">Birthday</Label>
          <Controller
            control={control}
            name="principal.birthday"
            render={({ field }) => (
              <Input id="birthday" type="date" {...field} aria-invalid={!!errors?.birthday} />
            )}
          />
          {errors?.birthday && (
            <p className="text-destructive text-sm">{errors.birthday.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="age">Age</Label>
          <Controller
            control={control}
            name="principal.age"
            render={({ field }) => <Input id="age" {...field} readOnly placeholder="" />}
          />
        </div>
      </div>

      {/* Civil Status */}
      <div className="grid gap-2">
        <Label htmlFor="civilStatus">Civil Status</Label>
        <Controller
          control={control}
          name="principal.civilStatus"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="civilStatus"
                aria-invalid={!!errors?.civilStatus}
                className="w-full"
              >
                <SelectValue placeholder="Select Civil Status" />
              </SelectTrigger>
              <SelectContent>
                {CIVIL_STATUS_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors?.civilStatus && (
          <p className="text-destructive text-sm">{errors.civilStatus.message}</p>
        )}
      </div>

      {/* Weekly Contribution */}
      <div className="grid gap-2">
        <Label htmlFor="weeklyContribution">Weekly Contribution</Label>
        <Controller
          control={control}
          name="principal.weeklyContribution"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="weeklyContribution"
                aria-invalid={!!errors?.weeklyContribution}
                className="w-full"
              >
                <SelectValue placeholder="Select Amount" />
              </SelectTrigger>
              <SelectContent>
                {WEEKLY_CONTRIBUTION_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors?.weeklyContribution && (
          <p className="text-destructive text-sm">{errors.weeklyContribution.message}</p>
        )}
      </div>
    </div>
  )
}
