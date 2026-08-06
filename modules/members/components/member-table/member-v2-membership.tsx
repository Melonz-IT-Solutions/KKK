const membershipStyles: Record<string, string> = {
  Regular: ' ring-1 ring-inset ',
  Premium: '',
  VIP: '',
};

function normalizeMembershipValue(value: string) {
  const normalized = value?.trim().toLowerCase();

  if (
    normalized === '25' ||
    normalized === '25.00' ||
    normalized === 'regular'
  ) {
    return 'Regular';
  }

  if (
    normalized === '50' ||
    normalized === '50.00' ||
    normalized === 'premium'
  ) {
    return 'Premium';
  }

  return value;
}

interface MembershipBadgeProps {
  value: string;
}

export default function MembershipBadge({ value }: MembershipBadgeProps) {
  const normalizedValue = normalizeMembershipValue(value);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        membershipStyles[normalizedValue] || membershipStyles.Regular
      }`}
    >
      {normalizedValue}
    </span>
  );
}
