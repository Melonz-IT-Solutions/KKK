import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { hasPermission } from '@/lib/auth/permissions'
import ReportsPage from '@/modules/reports/components/reports-view/reports-view-page'

export default async function ReportsRoute() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (!hasPermission(session.user.role, 'reports:view')) redirect('/unauthorized')

  return <ReportsPage />
}
