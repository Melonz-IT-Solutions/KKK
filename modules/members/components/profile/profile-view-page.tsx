'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserRound, UsersRound, HeartHandshake } from 'lucide-react'
import EditMemberProfile from '@/modules/members/components/profile/edit-member-profile'
import { formatDate } from '@/lib/utils/date'

interface MemberProfilePageProps {
  profile: Awaited<ReturnType<typeof import('@/lib/services/member-service').getMemberProfile>>
}

export default function MemberProfilePage({ profile }: MemberProfilePageProps) {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  if (!profile) {
    return null
  }

  if (isEditing) {
    return (
      <EditMemberProfile
        profile={profile}
        onCancel={() => setIsEditing(false)}
        onSaved={() => {
          setIsEditing(false)
          router.refresh()
        }}
      />
    )
  }

  const { principal, beneficiaries, dependents } = profile

  return (
    <div className="w-full max-w-6xl space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
        <div className="flex items-start gap-3">
          <div className="bg-primary flex size-11 shrink-0 items-center justify-center rounded-lg text-white shadow-sm">
            <UserRound className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-emerald-950">{principal.fullName}</h1>

              <Badge
                className={
                  principal.isDeleted
                    ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-50'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                }
              >
                {principal.isDeleted ? 'Inactive' : 'Active'}
              </Badge>
            </div>

            <p className="text-sm text-emerald-700/80">
              Member #{principal.id}
              {principal.membershipLabel ? ` • ${principal.membershipLabel}` : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-primary flex shrink-0 cursor-pointer items-center gap-1 self-start rounded-md px-3 py-2 text-sm text-white"
          >
            Edit Member
          </button>
        </div>
      </div>

      {/* Principal Member */}
      <div className="group/card bg-card text-card-foreground ring-foreground/10 flex flex-col gap-4 overflow-hidden rounded-xl border-emerald-100 text-sm shadow-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl">
        <CardHeader className="border-b border-emerald-100 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <UserRound className="size-4" />
            </div>

            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                I. Principal Member
              </CardTitle>

              <p className="mt-0.5 text-xs text-slate-500">Basic member information</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="bg-slate-50/30 p-5 md:p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <ProfileField label="First Name" value={principal.firstName} />

            <ProfileField label="Middle Name" value={principal.middleName} />

            <ProfileField label="Last Name" value={principal.lastName} />

            <ProfileField label="Date of Birth" value={formatDate(principal.dateOfBirth)} />

            <ProfileField label="Age" value={principal.age} />

            <ProfileField
              label="Membership"
              value={principal.membershipLabel ?? principal.membership}
              accent
            />

            <ProfileField label="Civil Status" value={principal.civilStatus} />

            <ProfileField label="Branch" value={principal.branch} />

            <div className="md:col-span-2">
              <ProfileField label="Residential Address" value={principal.address} />
            </div>
          </div>
        </CardContent>
      </div>

      {/* Beneficiaries */}
      <div className="group/card bg-card text-card-foreground ring-foreground/10 flex flex-col gap-4 overflow-hidden rounded-xl border-emerald-100 text-sm shadow-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl">
        <CardHeader className="border-b border-emerald-100 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <HeartHandshake className="size-4" />
            </div>

            <div>
              <CardTitle className="text-sm font-bold text-slate-900">II. Beneficiaries</CardTitle>

              <p className="mt-0.5 text-xs text-slate-500">Registered beneficiaries</p>
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

                  {beneficiary ? (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <ProfileField label="Full Name" value={beneficiary.name} />
                      </div>

                      <ProfileField label="Birthday" value={beneficiary.birthday} />

                      <ProfileField label="Gender" value={beneficiary.gender} />

                      <ProfileField label="Relationship" value={beneficiary.relationship} />

                      <div className="sm:col-span-2">
                        <ProfileField label="Address" value={beneficiary.address} />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                      <p className="text-sm text-slate-400">Not provided</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </div>

      {/* Dependents */}
      <div className="group/card bg-card text-card-foreground ring-foreground/10 flex flex-col gap-4 overflow-hidden rounded-xl border-emerald-100 text-sm shadow-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl">
        <CardHeader className="border-b border-emerald-100 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <UsersRound className="size-4" />
            </div>

            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                III. Dependents
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {dependents.length}
                </span>
              </CardTitle>

              <p className="mt-0.5 text-xs text-slate-500">Registered dependents</p>
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

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <ProfileField label="Full Name" value={dependent.name} />
                    </div>

                    <ProfileField label="Gender" value={dependent.gender} />

                    <ProfileField label="Birthday" value={dependent.birthday} />

                    <div className="sm:col-span-2">
                      <ProfileField label="Address" value={dependent.address} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Profile field
// ---------------------------------------------------------------------------

function ProfileField({
  label,
  value,
  accent = false,
}: {
  label: string
  value?: string | number | null
  accent?: boolean
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{label}</p>

      <p
        className={
          accent
            ? 'mt-1 text-sm font-semibold text-emerald-700'
            : 'mt-1 text-sm font-medium text-slate-800'
        }
      >
        {value !== null && value !== undefined && String(value).trim() !== '' ? value : '—'}
      </p>
    </div>
  )
}
