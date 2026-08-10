import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { hasPermission } from '@/lib/auth/permissions'
import SettingsPageView from '@/modules/settings/components/settings-page-view'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (!hasPermission(session.user.role, 'settings:access')) redirect('/unauthorized')

  return <SettingsPageView />
}
