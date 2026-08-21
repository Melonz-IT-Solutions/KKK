import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { hasPermission } from '@/lib/auth/permissions'
import ActivityLogsPage from '@/modules/activity-log'

export default async function ActivityLogPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (!hasPermission(session.user.role, 'activity_logs:view')) redirect('/unauthorized')

  return <ActivityLogsPage />
}
