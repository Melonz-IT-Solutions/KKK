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
import { DEPARTMENTS } from '@/constants/departments'
import { hasPermission } from '@/lib/auth/permissions'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const role = session?.user?.role

  const filteredItems = NavigationItems.filter(item => {
    if (!role) return false
    if (item.title === 'Settings') return hasPermission(role, 'settings:access')
    if (item.title === 'Activity Log') return hasPermission(role, 'activity_logs:view')
    if (item.title === 'Reports') return hasPermission(role, 'reports:view')
    if (item.title === 'Staff') {
      return hasPermission(role, 'staff:view_all') || hasPermission(role, 'staff:view_own_branch')
    }
    return true
  })

  const user = {
    name: session?.user?.name ?? 'Loading user',
    email: session?.user?.email ?? '',
    avatar: '/avatars/avatar.jpg',
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DepartmentSwitcher departments={DEPARTMENTS} />
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
