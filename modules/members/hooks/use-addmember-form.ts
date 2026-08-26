import { useState } from 'react'

import { useForm, useWatch } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { memberFormSchema } from '@/modules/members/schema/member-form'

import type { MemberFormValues, MemberTab } from '@/modules/members/types/member'

import { defaultMemberFormValues } from '@/modules/members/constants/member-form'

import { getFirstInvalidMemberTab, isPrincipalComplete } from '@/modules/members/utils/member-form'

interface UseAddMemberFormProps {
  onSave?: (payload: MemberFormValues) => void | Promise<void>

  onOpenChange: (open: boolean) => void
}

export function useAddMemberForm({ onSave, onOpenChange }: UseAddMemberFormProps) {
  const [tab, setTab] = useState<MemberTab>('principal')

  const [isSaving, setIsSaving] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: defaultMemberFormValues,
    mode: 'onChange',
  })

  const principal = useWatch({
    control,
    name: 'principal',
  })

  const saveDisabled = !isPrincipalComplete(principal) || isSubmitting || isSaving

  const goToFirstInvalidTab = () => {
    setTab(getFirstInvalidMemberTab(errors))
  }

  const onSubmit = async (values: MemberFormValues) => {
    if (isSaving) {
      return
    }

    setIsSaving(true)

    try {
      await onSave?.(values)

      reset(defaultMemberFormValues)
      setTab('principal')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save member:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const onInvalid = () => {
    goToFirstInvalidTab()
  }

  const handleCancel = () => {
    if (isSaving || isSubmitting) {
      return
    }

    reset(defaultMemberFormValues)
    setTab('principal')
    onOpenChange(false)
  }

  return {
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
  }
}
