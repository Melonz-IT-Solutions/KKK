import { UserRound } from 'lucide-react'

interface EditMemberHeaderProps {
  memberId: number
}

export function EditMemberHeader({ memberId }: EditMemberHeaderProps) {
  return (
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
          Member #{memberId}
        </div>
      </div>
    </div>
  )
}
