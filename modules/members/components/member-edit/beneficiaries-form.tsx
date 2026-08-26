'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { HeartHandshake } from 'lucide-react'

import { BeneficiaryCard } from './beneficiary-card'

import type { MemberProfile } from '@/modules/members/types/member-profile'

interface BeneficiariesFormProps {
  beneficiaries: MemberProfile['beneficiaries']
  onChange: (
    role: 'primary' | 'secondary',
    key: 'name' | 'address' | 'birthday' | 'gender' | 'relationship',
    value: string
  ) => void
}

export function BeneficiariesForm({ beneficiaries, onChange }: BeneficiariesFormProps) {
  return (
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
          {(['primary', 'secondary'] as const).map(role => (
            <BeneficiaryCard
              key={role}
              role={role}
              beneficiary={beneficiaries[role]}
              onChange={onChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
