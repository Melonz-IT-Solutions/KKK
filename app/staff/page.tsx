import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { hasPermission } from '@/lib/auth/permissions'
import StaffPage from '@/modules/staff/components/staff-view/staff-v2-view-page'

export default async function Page() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const canViewStaff =
    hasPermission(session.user.role, 'staff:view_all') ||
    hasPermission(session.user.role, 'staff:view_own_branch')

  if (!canViewStaff) redirect('/unauthorized')

  return <StaffPage />
}
