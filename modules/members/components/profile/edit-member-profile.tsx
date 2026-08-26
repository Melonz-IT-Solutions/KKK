'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button as ButtonV2 } from '@/components/button-v2/button'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

import { showErrorToast, showSuccessToast } from '@/lib/toast-messagealert/showSuccessToast'

import { UserRound, UsersRound, HeartHandshake, Save, X } from 'lucide-react'

import { BranchCombobox } from '@/modules/members/components/add-member/branch-combobox'

type MemberProfile = NonNullable<
  Awaited<ReturnType<typeof import('@/lib/services/member-service').getMemberProfile>>
>

interface EditMemberProfileProps {
  profile: MemberProfile
  onSaved?: () => void | Promise<void>
  onCancel?: () => void
}

export default function EditMemberProfile({ profile, onSaved, onCancel }: EditMemberProfileProps) {
  const [formState, setFormState] = useState<MemberProfile>(profile)

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFormState(profile)
  }, [profile])

  const { principal, beneficiaries, dependents } = formState

  function updatePrincipal<K extends keyof MemberProfile['principal']>(
    key: K,
    value: MemberProfile['principal'][K]
  ) {
    setFormState(prev => ({
      ...prev,
      principal: {
        ...prev.principal,
        [key]: value,
      },
    }))
  }

  function updateBeneficiary(
    role: 'primary' | 'secondary',
    key: 'name' | 'address' | 'birthday' | 'gender' | 'relationship',
    value: string
  ) {
    setFormState(prev => ({
      ...prev,
      beneficiaries: {
        ...prev.beneficiaries,
        [role]: {
          ...(prev.beneficiaries[role] ?? {
            name: '',
            address: '',
            birthday: '',
            gender: '',
            relationship: '',
          }),
          [key]: value,
        },
      },
    }))
  }

  function updateDependent(
    index: number,
    key: 'name' | 'address' | 'birthday' | 'gender',
    value: string
  ) {
    setFormState(prev => ({
      ...prev,
      dependents: prev.dependents.map((dependent, i) =>
        i === index
          ? {
              ...dependent,
              [key]: value,
            }
          : dependent
      ),
    }))
  }

  async function handleSave() {
    try {
      setSaving(true)

      const response = await fetch(`/api/members/${principal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message ?? 'Failed to update member profile')
      }

      showSuccessToast('Member profile updated successfully')

      await onSaved?.()
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to update member profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <UserRound className="size-5" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-emerald-950">Edit Member Profile</h1>

              <p className="mt-0.5 text-sm text-emerald-700/80">
                Update member information, beneficiaries, and dependents.
              </p>
            </div>
          </div>

          <div className="hidden rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 sm:block">
            Member #{principal.id}
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-emerald-100 shadow-sm">
        <CardHeader className="border-b border-emerald-100 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <UserRound className="size-4" />
            </div>

            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                I. Principal Member
              </CardTitle>

              <p className="mt-0.5 text-xs text-slate-500">Basic information of the member</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="bg-slate-50/30 p-5 md:p-6">
          <div className="grid gap-5 md:grid-cols-3">
            <FormField label="First Name">
              <Input
                value={principal.firstName ?? ''}
                onChange={e => updatePrincipal('firstName', e.target.value)}
              />
            </FormField>

            <FormField label="Middle Name">
              <Input
                value={principal.middleName ?? ''}
                onChange={e => updatePrincipal('middleName', e.target.value)}
              />
            </FormField>

            <FormField label="Last Name">
              <Input
                value={principal.lastName ?? ''}
                onChange={e => updatePrincipal('lastName', e.target.value)}
              />
            </FormField>

            <FormField label="Branch">
              <BranchCombobox
                value={principal.branch}
                onChange={value => updatePrincipal('branch', value)}
              />
            </FormField>

            <FormField label="Age">
              <Input
                type="number"
                value={principal.age ?? ''}
                onChange={e => updatePrincipal('age', Number(e.target.value))}
              />
            </FormField>

            <FormField label="Membership">
              <Select
                value={principal.membership ?? ''}
                onValueChange={value => updatePrincipal('membership', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select membership" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="25">Regular</SelectItem>

                  <SelectItem value="50">Premium</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Civil Status">
              <Select
                value={principal.civilStatus ?? ''}
                onValueChange={value => updatePrincipal('civilStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select civil status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>

                  <SelectItem value="Married">Married</SelectItem>

                  <SelectItem value="Widowed">Widowed</SelectItem>

                  <SelectItem value="Separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <div className="md:col-span-3">
              <FormField label="Residential Address">
                <Textarea
                  className="min-h-22.5 resize-none"
                  value={principal.address ?? ''}
                  onChange={e => updatePrincipal('address', e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Visibility">
              <Select
                value={principal.isDeleted ? 'inactive' : 'active'}
                onValueChange={value => updatePrincipal('isDeleted', value === 'inactive')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>

                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-emerald-100 shadow-sm">
        <CardHeader className="border-b border-emerald-100 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <HeartHandshake className="size-4" />
            </div>

            <div>
              <CardTitle className="text-sm font-bold text-slate-900">II. Beneficiaries</CardTitle>

              <p className="mt-0.5 text-xs text-slate-500">
                People designated to receive member benefits
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="bg-slate-50/30 p-5 md:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            {(['primary', 'secondary'] as const).map(role => {
              const beneficiary = beneficiaries[role]

              return (
                <div
                  key={role}
                  className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-xs font-bold tracking-wide text-emerald-700 uppercase">
                      {role === 'primary' ? 'Primary Beneficiary' : 'Secondary Beneficiary'}
                    </p>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                      {role === 'primary' ? 'Primary' : 'Secondary'}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FormField label="Full Name">
                        <Input
                          value={beneficiary?.name ?? ''}
                          onChange={e => updateBeneficiary(role, 'name', e.target.value)}
                        />
                      </FormField>
                    </div>

                    <FormField label="Birthday">
                      <Input
                        type="date"
                        value={beneficiary?.birthday ?? ''}
                        onChange={e => updateBeneficiary(role, 'birthday', e.target.value)}
                      />
                    </FormField>

                    <FormField label="Gender">
                      <Select
                        value={beneficiary?.gender ?? ''}
                        onValueChange={value => updateBeneficiary(role, 'gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>

                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Relationship">
                      <Input
                        value={beneficiary?.relationship ?? ''}
                        onChange={e => updateBeneficiary(role, 'relationship', e.target.value)}
                      />
                    </FormField>

                    <div className="sm:col-span-2">
                      <FormField label="Address">
                        <Input
                          value={beneficiary?.address ?? ''}
                          onChange={e => updateBeneficiary(role, 'address', e.target.value)}
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-emerald-100 shadow-sm">
        <CardHeader className="border-b border-emerald-100 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <UsersRound className="size-4" />
            </div>

            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                III. Dependents
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                  {dependents.length}
                </span>
              </CardTitle>

              <p className="mt-0.5 text-xs text-slate-500">Family members and dependents</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="bg-slate-50/30 p-5 md:p-6">
          {dependents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
              <UsersRound className="mx-auto size-7 text-emerald-500" />

              <p className="mt-2 text-sm font-medium text-slate-700">No dependents on file</p>

              <p className="mt-1 text-xs text-slate-500">
                This member currently has no registered dependents.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {dependents.map((dependent, index) => (
                <div
                  key={dependent.id}
                  className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-xs font-bold tracking-wide text-emerald-700 uppercase">
                      Dependent {index + 1}
                    </p>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FormField label="Full Name">
                        <Input
                          value={dependent.name ?? ''}
                          onChange={e => updateDependent(index, 'name', e.target.value)}
                        />
                      </FormField>
                    </div>

                    <FormField label="Gender">
                      <Select
                        value={dependent.gender ?? ''}
                        onValueChange={value => updateDependent(index, 'gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>

                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Birthday">
                      <Input
                        type="date"
                        value={dependent.birthday ?? ''}
                        onChange={e => updateDependent(index, 'birthday', e.target.value)}
                      />
                    </FormField>

                    <div className="sm:col-span-2">
                      <FormField label="Address">
                        <Input
                          value={dependent.address ?? ''}
                          onChange={e => updateDependent(index, 'address', e.target.value)}
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-emerald-100 bg-white/95 px-4 py-4 backdrop-blur md:-mx-6 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p className="hidden text-xs text-slate-500 sm:block">
            Review the information before saving changes.
          </p>

          <div className="ml-auto flex gap-2">
            <ButtonV2
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={saving}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <X className="mr-1.5 size-4" />
              Cancel
            </ButtonV2>

            <ButtonV2
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
            >
              <Save className="mr-1.5 size-4" />

              {saving ? 'Saving...' : 'Save Changes'}
            </ButtonV2>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
      </Label>

      {children}
    </div>
  )
}
