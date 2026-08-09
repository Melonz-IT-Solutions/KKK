// modules/members/components/add-member/member-v2-addmember.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/button-v2/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useState } from 'react'

import {
  memberFormSchema,
  defaultMemberFormValues,
  type MemberFormValues,
} from '@/modules/members/schema/member-schema'
import { PrincipalMemberFields } from '@/modules/members/components/add-member/principal-member-fields'
import { BeneficiariesTab } from '@/modules/members/components/add-member/beneficiaries-tab'
import { DependentsTab } from '@/modules/members/components/add-member/dependents-tab'

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
    mode: 'onChange',
  })

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
              <PrincipalMemberFields
                control={control}
                errors={errors.principal}
                watch={watch}
                setValue={setValue}
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
              <DependentsTab
                control={control}
                errors={errors.dependents}
                watch={watch}
                setValue={setValue}
              />
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
