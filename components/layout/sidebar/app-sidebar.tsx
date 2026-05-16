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
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from 'lucide-react'
import { NavigationItems } from '@/constants/navigation-items'
import { DEPARTMENTS } from '@/constants/departments'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
