import { create } from 'zustand'

import type { ActiveRole, Permission } from '@/lib/auth/permissions'

interface RoleStore {
  activeRole: ActiveRole | null
  realRole: ActiveRole | null
  permissions: Permission[]
  roleLoading: boolean
  setActiveRole: (role: ActiveRole | null) => void
  setRealRole: (role: ActiveRole | null) => void
  setPermissions: (permissions: Permission[]) => void
  setRoleLoading: (loading: boolean) => void
}

export const useRoleStore = create<RoleStore>()(set => ({
  activeRole: null,
  realRole: null,
  permissions: [],
  roleLoading: true,
  setActiveRole: role => set({ activeRole: role }),
  setRealRole: role => set({ realRole: role }),
  setPermissions: permissions => set({ permissions }),
  setRoleLoading: loading => set({ roleLoading: loading }),
}))
