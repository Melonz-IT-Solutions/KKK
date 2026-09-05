import { create } from 'zustand'

import type { ActiveRole, Permission } from '@/lib/auth/permissions'
import type { ClusterWithBranches } from '@/modules/members/hooks/use-clusters'

interface RoleStore {
  // Real authenticated role — the user's actual DB role, never changes after login
  realRole: ActiveRole | null

  // Active/temporary role — SUPER_ADMIN can switch to another department role
  activeRole: ActiveRole | null
  activeEntityName: string | null
  permissions: Permission[]

  // All clusters — fetched once for SUPER_ADMIN to populate the department switcher
  // This is always fetched using the real role (not the effective/cookie role)
  clusters: ClusterWithBranches[]

  // UI state
  roleLoading: boolean

  // Actions
  setRealRole: (role: ActiveRole | null) => void
  setActiveRole: (role: ActiveRole | null) => void
  setActiveEntityName: (name: string | null) => void
  setPermissions: (permissions: Permission[]) => void
  setClusters: (clusters: ClusterWithBranches[]) => void
  setRoleLoading: (loading: boolean) => void
}

export const useRoleStore = create<RoleStore>()(set => ({
  realRole: null,
  activeRole: null,
  activeEntityName: null,
  permissions: [],
  clusters: [],
  roleLoading: true,
  setRealRole: role => set({ realRole: role }),
  setActiveRole: role => set({ activeRole: role }),
  setActiveEntityName: name => set({ activeEntityName: name }),
  setPermissions: permissions => set({ permissions }),
  setClusters: clusters => set({ clusters }),
  setRoleLoading: loading => set({ roleLoading: loading }),
}))
