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

interface DependentCardProps {
  dependent: MemberProfile['dependents'][number]
  index: number
  onChange: (index: number, key: 'name' | 'address' | 'birthday' | 'gender', value: string) => void
}

export function DependentCard({ dependent, index, onChange }: DependentCardProps) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
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
              onChange={e => onChange(index, 'name', e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Gender">
          <Select
            value={dependent.gender ?? ''}
            onValueChange={value => onChange(index, 'gender', value)}
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
            onChange={e => onChange(index, 'birthday', e.target.value)}
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Address">
            <Input
              value={dependent.address ?? ''}
              onChange={e => onChange(index, 'address', e.target.value)}
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}
