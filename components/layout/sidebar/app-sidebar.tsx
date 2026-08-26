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

import { hasPermission, type ActiveRole } from '@/lib/auth/permissions'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()

  const [activeRole, setActiveRole] = React.useState<ActiveRole | null>(null)

  const [realRole, setRealRole] = React.useState<ActiveRole | null>(null)

  const [roleLoading, setRoleLoading] = React.useState(true)

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
  }, [status])

  const filteredItems = React.useMemo(() => {
    if (!activeRole) {
      return []
    }

    return NavigationItems.filter(item => {
      switch (item.title) {
        case 'Settings':
          return hasPermission(activeRole, 'settings:access')

        case 'Activity Log':
          return hasPermission(activeRole, 'activity_logs:view')

        case 'Reports':
          return hasPermission(activeRole, 'reports:view')

        case 'Staff':
          return (
            hasPermission(activeRole, 'staff:view_all') ||
            hasPermission(activeRole, 'staff:view_own_branch')
          )

        default:
          return true
      }
    })
  }, [activeRole])

  const user = React.useMemo(
    () => ({
      name: session?.user?.name ?? 'Loading user',
      email: session?.user?.email ?? '',
      avatar: '/avatars/avatar.jpg',
    }),
    [session?.user?.name, session?.user?.email]
  )

  if (status === 'loading' || roleLoading || !activeRole) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <DepartmentSwitcher
            activeRole={activeRole}
            realRole={realRole}
            onRoleChange={setActiveRole}
          />
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
        <DepartmentSwitcher
          activeRole={activeRole}
          realRole={realRole}
          onRoleChange={setActiveRole}
        />
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
