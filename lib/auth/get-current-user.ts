import { auth } from '@/auth'
import { getActiveRoleContext, getRoleContext } from '@/lib/auth/effective-role'
import { prisma } from '@/lib/prisma'

export interface CurrentActor {
  id: number
  name: string
  role: string
  branch: string | null
  clusterId: number | null
}

/**
 * Resolves the acting user's EFFECTIVE role/scope, not the raw DB role.
 *
 * A Super Admin who has switched departments (e.g. "Branch Manager (Isabela)")
 * via the department switcher must be scoped to that branch/cluster here,
 * otherwise every role-scoped read (members, clusters, imports, etc.) falls
 * through to the "no filter" Super Admin branch and leaks other branches' data.
 */
export async function getCurrentActor(): Promise<CurrentActor | null> {
  const session = await auth()
  if (!session?.user) return null

  const context = await getRoleContext()

  if (!context.user || !context.effectiveRole) {
    return null
  }

  const role: string = context.effectiveRole
  let branch: string | null = session.user.branch ?? null
  let clusterId: number | null = null

  if (context.isSuperAdmin && role !== 'SUPER_ADMIN') {
    const activeContext = await getActiveRoleContext()

    if (role === 'BRANCH_MANAGER') {
      const branchRecord = activeContext.branchId
        ? await prisma.branch.findUnique({ where: { id: activeContext.branchId } })
        : null

      branch = branchRecord?.name ?? null
    } else if (role === 'CLUSTER_MANAGER') {
      branch = null
      clusterId = activeContext.clusterId
    } else {
      branch = null
    }
  }

  return {
    id: Number(session.user.id),
    name: session.user.name || '',
    role,
    branch,
    clusterId,
  }
}

export async function getCurrentActorName(): Promise<string> {
  const actor = await getCurrentActor()
  return actor?.name ?? 'System'
}

/**
 * Cluster ids the acting user manages.
 *
 * Prefers the actively-switched cluster (Super Admin acting as Cluster
 * Manager) over the real ClusterManager assignments so impersonation is
 * scoped to the selected cluster instead of the admin's own (nonexistent)
 * assignments.
 */
export async function getManagedClusterIds(actor: CurrentActor): Promise<number[]> {
  if (actor.clusterId) {
    return [actor.clusterId]
  }

  const clusterManagers = await prisma.clusterManager.findMany({
    where: { userId: actor.id },
    select: { clusterId: true },
  })

  return clusterManagers.map(cm => cm.clusterId)
}
