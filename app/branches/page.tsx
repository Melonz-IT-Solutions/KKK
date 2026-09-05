import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { hasPermissionAsync } from '@/lib/auth/get-role-permissions'

import BranchesModule from '@/modules/clusters-branches/branches-module'

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const canView = await hasPermissionAsync(session.user.role, 'branch:view')

  if (!canView) {
    redirect('/unauthorized')
  }

  return <BranchesModule />
}
