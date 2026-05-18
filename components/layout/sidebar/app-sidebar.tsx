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

const user = {
  name: 'Super Admin',
  email: 'super-admin@kkk.com',
  avatar: '/avatars/avatar.jpg',
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DepartmentSwitcher departments={DEPARTMENTS} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NavigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
