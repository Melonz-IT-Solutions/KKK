import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { hasPermission } from '@/lib/auth/permissions'

import StaffModule from '@/modules/staff'

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const canViewStaff =
    hasPermission(session.user.role, 'staff:view_all') ||
    hasPermission(session.user.role, 'staff:view_own_branch')

  if (!canViewStaff) {
    redirect('/unauthorized')
  }

  return <StaffModule />
}
