export const membershipStyles: Record<string, string> = {
  Regular: ' ring-1 ring-inset ',
  Premium: '',
  VIP: '',
}

export function normalizeMembershipValue(value: string) {
  const normalized = value?.trim().toLowerCase()

  if (normalized === '25' || normalized === '25.00' || normalized === 'regular') {
    return 'Regular'
  }

  if (normalized === '50' || normalized === '50.00' || normalized === 'premium') {
    return 'Premium'
  }

  return value
}

export function getMemberFullName(row: {
  firstName: string
  middleName?: string | null
  lastName: string
}) {
  return [row.firstName, row.middleName, row.lastName].filter(Boolean).join(' ')
}
