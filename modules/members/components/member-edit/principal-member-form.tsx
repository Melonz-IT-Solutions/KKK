'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { UserRound } from 'lucide-react'

import { BranchCombobox } from '@/modules/members/components/add-member/branch-combobox'

import { FormField } from './form-field'

import type { MemberProfile } from '@/modules/members/types/member-profile'

interface PrincipalMemberFormProps {
  principal: MemberProfile['principal']
  onChange: <K extends keyof MemberProfile['principal']>(
    key: K,
    value: MemberProfile['principal'][K]
  ) => void
}

export function PrincipalMemberForm({ principal, onChange }: PrincipalMemberFormProps) {
  return (
    <Card className="overflow-hidden border-emerald-100 shadow-sm">
      <CardHeader className="border-b border-emerald-100 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <UserRound className="size-4" />
          </div>

          <div>
            <CardTitle className="text-sm font-bold text-slate-900">I. Principal Member</CardTitle>

            <p className="mt-0.5 text-xs text-slate-500">Basic information of the member</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-slate-50/30 p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-3">
          <FormField label="First Name">
            <Input
              value={principal.firstName ?? ''}
              onChange={e => onChange('firstName', e.target.value)}
            />
          </FormField>

          <FormField label="Middle Name">
            <Input
              value={principal.middleName ?? ''}
              onChange={e => onChange('middleName', e.target.value)}
            />
          </FormField>

          <FormField label="Last Name">
            <Input
              value={principal.lastName ?? ''}
              onChange={e => onChange('lastName', e.target.value)}
            />
          </FormField>

          <FormField label="Branch">
            <BranchCombobox
              value={principal.branch}
              onChange={value => onChange('branch', value)}
            />
          </FormField>

          <FormField label="Age">
            <Input
              type="number"
              value={principal.age ?? ''}
              onChange={e => onChange('age', Number(e.target.value))}
            />
          </FormField>

          <FormField label="Membership">
            <Select
              value={principal.membership ?? ''}
              onValueChange={value => onChange('membership', value)}
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
              onValueChange={value => onChange('civilStatus', value)}
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
                onChange={e => onChange('address', e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Visibility">
            <Select
              value={principal.isDeleted ? 'inactive' : 'active'}
              onValueChange={value => onChange('isDeleted', value === 'inactive')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </CardContent>
    </Card>
  )
}
