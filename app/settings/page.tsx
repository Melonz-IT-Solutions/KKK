import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { hasPermissionAsync } from '@/lib/auth/get-role-permissions'
import SettingsPageView from '@/modules/settings'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (!(await hasPermissionAsync(session.user.role, 'settings:access'))) redirect('/unauthorized')

  return <SettingsPageView />
}
