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

import {
  CIVIL_STATUS_OPTIONS,
  WEEKLY_CONTRIBUTION_OPTIONS,
} from '@/modules/members/constants/member-form'

import { BranchCombobox } from '@/modules/members/components/add-member/branch-combobox'

import type { MemberFormValues } from '@/modules/members/types/member'
import { useComputedAge } from '@/modules/members/hooks/use-computed-age'

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
      {/* First Name */}
      <div className="grid gap-2">
        <Label htmlFor="firstName">First Name</Label>

        <Controller
          control={control}
          name="principal.firstName"
          render={({ field }) => (
            <Input
              id="firstName"
              placeholder="First name"
              {...field}
              value={field.value ?? ''}
              aria-invalid={!!errors?.firstName}
            />
          )}
        />

        {errors?.firstName && (
          <p className="text-destructive text-sm">{errors.firstName.message}</p>
        )}
      </div>

      {/* Middle Name */}
      <div className="grid gap-2">
        <Label htmlFor="middleName">Middle Name</Label>

        <Controller
          control={control}
          name="principal.middleName"
          render={({ field }) => (
            <Input
              id="middleName"
              placeholder="Middle name"
              {...field}
              value={field.value ?? ''}
              aria-invalid={!!errors?.middleName}
            />
          )}
        />

        {errors?.middleName && (
          <p className="text-destructive text-sm">{errors.middleName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="grid gap-2">
        <Label htmlFor="lastName">Last Name</Label>

        <Controller
          control={control}
          name="principal.lastName"
          render={({ field }) => (
            <Input
              id="lastName"
              placeholder="Last name"
              {...field}
              value={field.value ?? ''}
              aria-invalid={!!errors?.lastName}
            />
          )}
        />

        {errors?.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
      </div>

      {/* Branch */}
      <div className="grid gap-2">
        <Label htmlFor="branch">Branch</Label>

        <Controller
          control={control}
          name="principal.branch"
          render={({ field }) => (
            <BranchCombobox
              id="branch"
              value={field.value}
              onChange={field.onChange}
              invalid={!!errors?.branch}
            />
          )}
        />

        {errors?.branch && <p className="text-destructive text-sm">{errors.branch.message}</p>}
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
              value={field.value ?? ''}
              aria-invalid={!!errors?.address}
            />
          )}
        />

        {errors?.address && <p className="text-destructive text-sm">{errors.address.message}</p>}
      </div>

      {/* Birthday + Age */}
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label htmlFor="birthday">Birthday</Label>

          <Controller
            control={control}
            name="principal.birthday"
            render={({ field }) => (
              <Input
                id="birthday"
                type="date"
                {...field}
                value={field.value ?? ''}
                aria-invalid={!!errors?.birthday}
              />
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
            render={({ field }) => <Input id="age" {...field} value={field.value ?? ''} readOnly />}
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
            <Select value={field.value ?? ''} onValueChange={field.onChange}>
              <SelectTrigger
                id="civilStatus"
                className="w-full"
                aria-invalid={!!errors?.civilStatus}
              >
                <SelectValue placeholder="Select Civil Status" />
              </SelectTrigger>

              <SelectContent>
                {CIVIL_STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
            <Select value={field.value ?? ''} onValueChange={field.onChange}>
              <SelectTrigger
                id="weeklyContribution"
                className="w-full"
                aria-invalid={!!errors?.weeklyContribution}
              >
                <SelectValue placeholder="Select Amount" />
              </SelectTrigger>

              <SelectContent>
                {WEEKLY_CONTRIBUTION_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
