'use client'

import { useEffect } from 'react'

import { useSession } from 'next-auth/react'

import Button from '@/components/button-v2/button'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { AddMemberSheetProps } from '@/modules/members/types/member'

import { useAddMemberForm } from '@/modules/members/hooks/use-addmember-form'

import { PrincipalMemberFields } from '@/modules/members/components/add-member/principal-member-fields'

import { BeneficiariesTab } from '@/modules/members/components/add-member/beneficiaries-tab'

import { DependentTab } from '@/modules/members/components/add-member/dependents-tab'

export function AddMemberSheet({ open, onOpenChange, onSave }: AddMemberSheetProps) {
  const { data: session } = useSession()
  const isBranchManager = session?.user.role === 'BRANCH_MANAGER'

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    errors,
    isSubmitting,
    isSaving,
    tab,
    setTab,
    saveDisabled,
    onSubmit,
    onInvalid,
    handleCancel,
  } = useAddMemberForm({
    onSave,
    onOpenChange,
  })

  // Auto-populate branch for Branch Manager when sheet opens
  useEffect(() => {
    if (open && isBranchManager && session?.user.branch) {
      setValue('principal.branch', session.user.branch)
    }
  }, [open, isBranchManager, session?.user.branch, setValue])

  return (
    <Sheet
      open={open}
      onOpenChange={nextOpen => {
        if (!nextOpen && (isSaving || isSubmitting)) {
          return
        }

        onOpenChange(nextOpen)
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-xl font-semibold">Add Member</SheetTitle>

          <SheetDescription className="sr-only">
            Form to add a new member with beneficiaries and dependents.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Tabs
              value={tab}
              onValueChange={value => setTab(value as 'principal' | 'beneficiaries' | 'dependent')}
              className="p-4"
            >
              <TabsList className="flex w-full justify-center rounded-sm">
                <TabsTrigger
                  value="principal"
                  disabled={isSaving || isSubmitting}
                  className="data-[state=active]:bg-primary rounded-sm data-[state=active]:text-white"
                >
                  Principal Member
                </TabsTrigger>

                <TabsTrigger
                  value="beneficiaries"
                  disabled={isSaving || isSubmitting}
                  className="data-[state=active]:bg-primary rounded-sm data-[state=active]:text-white"
                >
                  Beneficiaries
                </TabsTrigger>

                <TabsTrigger
                  value="dependent"
                  disabled={isSaving || isSubmitting}
                  className="data-[state=active]:bg-primary rounded-sm data-[state=active]:text-white"
                >
                  Dependents
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {tab === 'principal' && (
              <PrincipalMemberFields
                control={control}
                errors={errors.principal}
                watch={watch}
                setValue={setValue}
                readOnlyBranch={isBranchManager}
              />
            )}

            {tab === 'beneficiaries' && (
              <BeneficiariesTab
                control={control}
                errors={errors.beneficiaries}
                watch={watch}
                setValue={setValue}
              />
            )}

            {tab === 'dependent' && (
              <DependentTab
                control={control}
                errors={errors.dependents}
                watch={watch}
                setValue={setValue}
              />
            )}
          </div>

          <div className="flex flex-col gap-4 border-t p-6">
            <Button type="submit" variant="primary" size="full" disabled={saveDisabled}>
              {isSaving || isSubmitting ? 'Saving...' : 'Save'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="full"
              disabled={isSaving || isSubmitting}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
