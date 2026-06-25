'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { Tooltip as TooltipPrimitive } from 'radix-ui'

// ─── Types ────────────────────────────────────────────────────────────────────

type Beneficiary = {
  name: string
  birthday: string
  sex: string
  relation: string
}

type Dependent = {
  name: string
  birthday: string
  sex: string
}

type Member = {
  id: string
  membership: 'Regular' | 'Associate'
  name: string
  address: string
  birthday: string
  civilStatus: string
  branch: string
  weeklyContribution: '25' | '50'
  primaryBeneficiary: Beneficiary
  secondaryBeneficiary: Beneficiary
  dependents: Dependent[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calculateAge(birthday: string): number {
  if (!birthday) return 0
  const today = new Date()
  const birth = new Date(birthday)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── Mock data (shared with members list) ─────────────────────────────────────

const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    membership: 'Regular',
    name: 'Juan dela Cruz',
    address: 'Talon-Talon, Zamboanga City',
    birthday: '1985-03-15',
    civilStatus: 'Married',
    branch: 'talon-talon',
    weeklyContribution: '50',
    primaryBeneficiary: { name: 'Maria dela Cruz', birthday: '1987-06-20', sex: 'Female', relation: 'Spouse' },
    secondaryBeneficiary: { name: 'Jose dela Cruz', birthday: '2010-01-10', sex: 'Male', relation: 'Child' },
    dependents: [{ name: 'Jose dela Cruz', birthday: '2010-01-10', sex: 'Male' }],
  },
  {
    id: '2',
    membership: 'Associate',
    name: 'Ana Reyes',
    address: 'Mercedes, Zamboanga City',
    birthday: '1990-07-22',
    civilStatus: 'Single',
    branch: 'mercedes',
    weeklyContribution: '25',
    primaryBeneficiary: { name: 'Pedro Reyes', birthday: '1960-04-05', sex: 'Male', relation: 'Parent' },
    secondaryBeneficiary: { name: 'Luisa Reyes', birthday: '1963-09-12', sex: 'Female', relation: 'Parent' },
    dependents: [],
  },
  {
    id: '3',
    membership: 'Regular',
    name: 'Roberto Santos',
    address: 'Tetuan, Zamboanga City',
    birthday: '1978-11-30',
    civilStatus: 'Married',
    branch: 'tetuan',
    weeklyContribution: '50',
    primaryBeneficiary: { name: 'Cecilia Santos', birthday: '1980-02-14', sex: 'Female', relation: 'Spouse' },
    secondaryBeneficiary: { name: 'Marco Santos', birthday: '2005-08-25', sex: 'Male', relation: 'Child' },
    dependents: [
      { name: 'Marco Santos', birthday: '2005-08-25', sex: 'Male' },
      { name: 'Liza Santos', birthday: '2008-03-18', sex: 'Female' },
    ],
  },
  {
    id: '4',
    membership: 'Associate',
    name: 'Fatima Hassan',
    address: 'Kabasalan, Zamboanga Sibugay',
    birthday: '1995-05-10',
    civilStatus: 'Single',
    branch: 'kabasalan',
    weeklyContribution: '25',
    primaryBeneficiary: { name: 'Ali Hassan', birthday: '1965-12-01', sex: 'Male', relation: 'Parent' },
    secondaryBeneficiary: { name: '', birthday: '', sex: '', relation: '' },
    dependents: [],
  },
  {
    id: '5',
    membership: 'Regular',
    name: 'Carlos Mendoza',
    address: 'IPIL, Zamboanga Sibugay',
    birthday: '1982-09-08',
    civilStatus: 'Widowed',
    branch: 'ipil',
    weeklyContribution: '50',
    primaryBeneficiary: { name: 'Elena Mendoza', birthday: '2008-07-17', sex: 'Female', relation: 'Child' },
    secondaryBeneficiary: { name: 'Ricardo Mendoza', birthday: '2012-11-23', sex: 'Male', relation: 'Child' },
    dependents: [
      { name: 'Elena Mendoza', birthday: '2008-07-17', sex: 'Female' },
      { name: 'Ricardo Mendoza', birthday: '2012-11-23', sex: 'Male' },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-2 py-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium">{value || '—'}</span>
    </div>
  )
}

function SectionTitle({
  children,
  tooltip,
}: {
  children: React.ReactNode
  tooltip?: string
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-base font-semibold">{children}</h2>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="text-muted-foreground size-4 cursor-help" />
            </TooltipTrigger>
            <TooltipPrimitive.Portal>
              <TooltipPrimitive.Content
                sideOffset={4}
                className="bg-foreground text-background z-50 inline-flex max-w-xs items-center rounded-md px-3 py-1.5 text-xs"
              >
                {tooltip}
                <TooltipPrimitive.Arrow className="fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const member = MOCK_MEMBERS.find((m) => m.id === params.id)

  if (!member) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Member not found.</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">{member.name}</h1>
          <Badge variant={member.membership === 'Regular' ? 'default' : 'secondary'}>
            {member.membership}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section I – Information of Principal Member */}
        <div className="rounded-xl border p-5">
          <SectionTitle>I. Information of Principal Member</SectionTitle>
          <div className="divide-y">
            <InfoRow label="Name" value={member.name} />
            <InfoRow label="Address" value={member.address} />
            <InfoRow label="Birthday" value={formatDate(member.birthday)} />
            <InfoRow label="Age" value={calculateAge(member.birthday)} />
            <InfoRow label="Civil Status" value={member.civilStatus} />
            <InfoRow
              label="Weekly Contribution"
              value={`₱${member.weeklyContribution}.00`}
            />
          </div>
        </div>

        {/* Section II – Beneficiaries */}
        <div className="rounded-xl border p-5">
          <SectionTitle
            tooltip="The beneficiary is the recipient of the claim in case of death of the principal member."
          >
            II. Beneficiaries
          </SectionTitle>

          <div className="space-y-5">
            {/* Primary */}
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                Primary Beneficiary
              </p>
              <div className="divide-y">
                <InfoRow label="Name" value={member.primaryBeneficiary.name} />
                <InfoRow
                  label="Birthday"
                  value={formatDate(member.primaryBeneficiary.birthday)}
                />
                <InfoRow
                  label="Age"
                  value={
                    member.primaryBeneficiary.birthday
                      ? calculateAge(member.primaryBeneficiary.birthday)
                      : '—'
                  }
                />
                <InfoRow label="Sex" value={member.primaryBeneficiary.sex} />
                <InfoRow
                  label="Relation"
                  value={member.primaryBeneficiary.relation}
                />
              </div>
            </div>

            <Separator />

            {/* Secondary */}
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                Secondary Beneficiary
              </p>
              {member.secondaryBeneficiary.name ? (
                <div className="divide-y">
                  <InfoRow label="Name" value={member.secondaryBeneficiary.name} />
                  <InfoRow
                    label="Birthday"
                    value={formatDate(member.secondaryBeneficiary.birthday)}
                  />
                  <InfoRow
                    label="Age"
                    value={
                      member.secondaryBeneficiary.birthday
                        ? calculateAge(member.secondaryBeneficiary.birthday)
                        : '—'
                    }
                  />
                  <InfoRow label="Sex" value={member.secondaryBeneficiary.sex} />
                  <InfoRow
                    label="Relation"
                    value={member.secondaryBeneficiary.relation}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">None specified.</p>
              )}
            </div>
          </div>
        </div>

        {/* Section III – Dependents */}
        <div className="rounded-xl border p-5 lg:col-span-2">
          <SectionTitle tooltip="For applicable programs only.">
            III. Dependents
          </SectionTitle>

          {member.dependents.length === 0 ? (
            <p className="text-muted-foreground text-sm">No dependents recorded.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {member.dependents.map((dep, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-1">
                  <p className="font-medium">{dep.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(dep.birthday)} · Age {calculateAge(dep.birthday)} · {dep.sex}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
