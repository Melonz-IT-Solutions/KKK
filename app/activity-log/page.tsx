import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { hasPermissionAsync } from '@/lib/auth/get-role-permissions'
import ActivityLogsPage from '@/modules/activity-log'

export default async function ActivityLogPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (!(await hasPermissionAsync(session.user.role, 'activity_logs:view')))
    redirect('/unauthorized')

  return <ActivityLogsPage />
}
