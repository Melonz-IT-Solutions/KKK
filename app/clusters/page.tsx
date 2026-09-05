import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { hasPermissionAsync } from '@/lib/auth/get-role-permissions'

import ClustersModule from '@/modules/clusters-branches'

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const canView = await hasPermissionAsync(session.user.role, 'cluster:view')

  if (!canView) {
    redirect('/unauthorized')
  }

  return <ClustersModule />
}
