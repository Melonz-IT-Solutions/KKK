'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { UsersRound } from 'lucide-react'

import { DependentCard } from './dependent-card'

import type { MemberProfile } from '@/modules/members/types/member-profile'

interface DependentsFormProps {
  dependents: MemberProfile['dependents']
  onChange: (index: number, key: 'name' | 'address' | 'birthday' | 'gender', value: string) => void
}

export function DependentsForm({ dependents, onChange }: DependentsFormProps) {
  return (
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
              <DependentCard
                key={dependent.id}
                dependent={dependent}
                index={index}
                onChange={onChange}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
