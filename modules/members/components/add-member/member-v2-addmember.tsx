'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/button-v2/button'
import Input from '@/components/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import {
  memberFormSchema,
  defaultMemberFormValues,
  type MemberFormValues,
} from '@/modules/members/schema/member-schema'
import {
  CIVIL_STATUS_OPTIONS,
  WEEKLY_CONTRIBUTION_OPTIONS,
} from '@/modules/members/constants/members'
import { useComputedAge } from '@/modules/members/hooks/use-computed-age'
import { BeneficiaryEntryFields } from '@/modules/members/components/add-member/beneficiary-entry-fields'
import { DependentEntryFields } from '@/modules/members/components/add-member/dependent-entry-fields'

interface AddMemberSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (payload: MemberFormValues) => void
}

export function AddMemberSheet({ open, onOpenChange, onSave }: AddMemberSheetProps) {
  const [tab, setTab] = useState<'principal' | 'beneficiaries' | 'dependent'>('principal')

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(memberFormSchema),
    defaultValues: defaultMemberFormValues,
    mode: 'onChange', // keeps isValid accurate as the user types, drives Save disabled state
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dependents',
  })

  useComputedAge(watch, setValue, 'principal.birthday', 'principal.age')

  // Jumps to the first tab that has a validation error, so the user always
  // lands on the section that needs attention — same behavior as before,
  // now driven by react-hook-form's error object instead of 3 hand-rolled
  // error-state objects.
  const goToFirstInvalidTab = () => {
    if (errors.principal) {
      setTab('principal')
    } else if (errors.beneficiaries) {
      setTab('beneficiaries')
    } else if (errors.dependents) {
      setTab('dependent')
    }
  }

  const onSubmit = (values: MemberFormValues) => {
    onSave?.(values)
    reset(defaultMemberFormValues)
    setTab('principal')
    onOpenChange(false)
  }

  const onInvalid = () => {
    goToFirstInvalidTab()
  }

  const handleCancel = () => {
    reset(defaultMemberFormValues)
    setTab('principal')
    onOpenChange(false)
  }

  const addDependent = () => {
    append({ name: '', address: '', birthday: '', age: '', gender: '' as never })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-xl font-semibold">Add Member</SheetTitle>
          <SheetDescription className="sr-only">
            Form to add a new member with beneficiaries and dependents.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="contents">
          <div className="flex-1 overflow-y-auto">
            <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)} className="p-4">
              <TabsList className="flex w-full justify-center rounded-sm">
                <TabsTrigger
                  className="data-[state=active]:bg-primary rounded-sm data-[state=active]:text-white"
                  value="principal"
                >
                  Principal Member
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-primary rounded-sm data-[state=active]:text-white"
                  value="beneficiaries"
                >
                  Beneficiaries
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-primary rounded-sm data-[state=active]:text-white"
                  value="dependent"
                >
                  Dependents
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {tab === 'principal' && (
              <div className="grid gap-4 p-6">
                {/* Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Controller
                    control={control}
                    name="principal.name"
                    render={({ field }) => (
                      <Input
                        id="name"
                        placeholder="Full name"
                        {...field}
                        aria-invalid={!!errors.principal?.name}
                      />
                    )}
                  />
                  {errors.principal?.name && (
                    <p className="text-destructive text-sm">{errors.principal.name.message}</p>
                  )}
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
                        aria-invalid={!!errors.principal?.address}
                      />
                    )}
                  />
                  {errors.principal?.address && (
                    <p className="text-destructive text-sm">{errors.principal.address.message}</p>
                  )}
                </div>

                {/* Birthday + Age */}
                <div className="flex justify-items-center gap-2">
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
                          aria-invalid={!!errors.principal?.birthday}
                        />
                      )}
                    />
                    {errors.principal?.birthday && (
                      <p className="text-destructive text-sm">
                        {errors.principal.birthday.message}
                      </p>
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
                          aria-invalid={!!errors.principal?.civilStatus}
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
                  {errors.principal?.civilStatus && (
                    <p className="text-destructive text-sm">
                      {errors.principal.civilStatus.message}
                    </p>
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
                          aria-invalid={!!errors.principal?.weeklyContribution}
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
                  {errors.principal?.weeklyContribution && (
                    <p className="text-destructive text-sm">
                      {errors.principal.weeklyContribution.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {tab === 'beneficiaries' && (
              <div className="grid gap-4 p-6">
                <BeneficiaryEntryFields
                  idPrefix="primary"
                  sectionLabel="Primary Beneficiary"
                  name="beneficiaries.primary"
                  control={control}
                  errors={errors.beneficiaries}
                  watch={watch}
                  setValue={setValue}
                />

                <div className="mt-2 border-t pt-4">
                  <BeneficiaryEntryFields
                    idPrefix="secondary"
                    sectionLabel="Secondary Beneficiary"
                    name="beneficiaries.secondary"
                    control={control}
                    errors={errors.beneficiaries}
                    watch={watch}
                    setValue={setValue}
                  />
                </div>
              </div>
            )}

            {tab === 'dependent' && (
              <div className="grid gap-4 p-6">
                {fields.map((field, index) => (
                  <DependentEntryFields
                    key={field.id}
                    index={index}
                    control={control}
                    errors={errors.dependents}
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
            )}
          </div>

          <div className="flex flex-col gap-4 border-t p-6">
            <Button type="submit" variant="primary" size="full" disabled={!isValid}>
              Save
            </Button>
            <Button type="button" variant="outline" size="full" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
