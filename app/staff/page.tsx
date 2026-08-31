import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { hasPermissionAsync } from '@/lib/auth/get-role-permissions'

import StaffModule from '@/modules/staff'

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const canViewStaff =
    (await hasPermissionAsync(session.user.role, 'staff:view_all')) ||
    (await hasPermissionAsync(session.user.role, 'staff:view_own_branch'))

  if (!canViewStaff) {
    redirect('/unauthorized')
  }

  return <StaffModule />
}
