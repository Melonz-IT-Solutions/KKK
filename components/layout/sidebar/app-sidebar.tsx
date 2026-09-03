'use client'

import * as React from 'react'

import { useSession } from 'next-auth/react'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { DepartmentSwitcher } from './department-switcher'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

import { NavigationItems } from '@/constants/navigation-items'

import type { Permission } from '@/lib/auth/permissions'
import { useRoleStore } from '@/lib/stores/role-store'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()

  const {
    activeRole,
    permissions,
    roleLoading,
    setActiveRole,
    setRealRole,
    setActiveEntityName,
    setPermissions,
    setRoleLoading,
    setClusters,
  } = useRoleStore()

  React.useEffect(() => {
    if (status !== 'authenticated') {
      return
    }

    let cancelled = false

    async function loadRole() {
      try {
        setRoleLoading(true)

        const response = await fetch('/api/auth/active-role', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })

        if (!response.ok) {
          return
        }

        const data = await response.json()

        if (cancelled || !data.success) {
          return
        }

        setActiveRole(data.role ?? null)
        setRealRole(data.realRole ?? null)
        setPermissions(data.permissions ?? [])
        setActiveEntityName(data.entityName ?? null)

        // For SUPER_ADMIN, pre-load all clusters so the department switcher
        // always has the full list — even after switching to a scoped role.
        if (data.isSuperAdmin) {
          fetch('/api/clusters?scope=admin', { cache: 'no-store' })
            .then(r => r.json())
            .then(clusters => {
              if (!cancelled && Array.isArray(clusters)) {
                setClusters(clusters)
              }
            })
            .catch(() => {})
        }
      } catch (error) {
        console.error('Failed to load active role:', error)
      } finally {
        if (!cancelled) {
          setRoleLoading(false)
        }
      }
    }

    loadRole()

    return () => {
      cancelled = true
    }
  }, [status, setActiveRole, setRealRole, setPermissions, setActiveEntityName, setRoleLoading, setClusters])

  const can = React.useCallback(
    (permission: Permission) => permissions.includes(permission),
    [permissions]
  )

  const filteredItems = React.useMemo(() => {
    if (!activeRole || permissions.length === 0) {
      return []
    }

    return NavigationItems.filter(item => {
      switch (item.title) {
        case 'Members':
          return can('member:view')

        case 'Settings':
          return can('settings:access')

        case 'Activity Logs':
          return can('activity_logs:view')

        case 'Reports':
          return can('reports:view')

        case 'Staff':
          return can('staff:view_all') || can('staff:view_own_branch')

        default:
          return true
      }
    })
  }, [activeRole, permissions, can])

  const user = React.useMemo(
    () => ({
      name: session?.user?.name ?? 'Loading user',
      email: session?.user?.email ?? '',
    }),
    [session?.user?.name, session?.user?.email]
  )

  if (status === 'loading' || roleLoading || !activeRole) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <DepartmentSwitcher />
        </SidebarHeader>

        <SidebarContent />

        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DepartmentSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
