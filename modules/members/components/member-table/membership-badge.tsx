import { membershipStyles, normalizeMembershipValue } from '@/modules/members/utils/member-table'

interface MembershipBadgeProps {
  value: string
}

export default function MembershipBadge({ value }: MembershipBadgeProps) {
  const normalizedValue = normalizeMembershipValue(value)

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        membershipStyles[normalizedValue] || membershipStyles.Regular
      }`}
    >
      {normalizedValue}
    </span>
  )
}
