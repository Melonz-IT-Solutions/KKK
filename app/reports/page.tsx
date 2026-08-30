import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { hasPermissionAsync } from '@/lib/auth/get-role-permissions'
import ReportsPage from '@/modules/reports'

export default async function ReportsRoute() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (!(await hasPermissionAsync(session.user.role, 'reports:view'))) redirect('/unauthorized')

  return <ReportsPage />
}
