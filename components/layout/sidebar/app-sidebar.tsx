'use client'

import * as React from 'react'

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
import { currentUser, isBranchManager } from '@/lib/data/current-user'

const user = {
  name: currentUser.name,
  email: currentUser.email,
  avatar: '/avatars/avatar.jpg',
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const filteredItems = isBranchManager(currentUser)
    ? NavigationItems.filter(item => item.title !== 'Settings' && item.title !== 'Active Log')
    : NavigationItems

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
