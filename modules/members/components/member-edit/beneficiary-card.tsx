'use client'

import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { FormField } from './form-field'

import type { MemberProfile } from '@/modules/members/types/member-profile'

interface BeneficiaryCardProps {
  role: 'primary' | 'secondary'
  beneficiary:
    MemberProfile['beneficiaries']['primary'] | MemberProfile['beneficiaries']['secondary']
  onChange: (
    role: 'primary' | 'secondary',
    key: 'name' | 'address' | 'birthday' | 'gender' | 'relationship',
    value: string
  ) => void
}

export function BeneficiaryCard({ role, beneficiary, onChange }: BeneficiaryCardProps) {
  const title = role === 'primary' ? 'Primary Beneficiary' : 'Secondary Beneficiary'

  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs font-bold tracking-wide text-emerald-700 uppercase">{title}</p>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
          {role === 'primary' ? 'Primary' : 'Secondary'}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField label="Full Name">
            <Input
              value={beneficiary?.name ?? ''}
              onChange={e => onChange(role, 'name', e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Birthday">
          <Input
            type="date"
            value={beneficiary?.birthday ?? ''}
            onChange={e => onChange(role, 'birthday', e.target.value)}
          />
        </FormField>

        <FormField label="Gender">
          <Select
            value={beneficiary?.gender ?? ''}
            onValueChange={value => onChange(role, 'gender', value)}
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
            onChange={e => onChange(role, 'relationship', e.target.value)}
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Address">
            <Input
              value={beneficiary?.address ?? ''}
              onChange={e => onChange(role, 'address', e.target.value)}
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}
