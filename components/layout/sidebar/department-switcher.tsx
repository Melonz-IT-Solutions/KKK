'use client'

import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { ChevronsUpDownIcon, Undo2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Logo from '../logo'
import { getNameByInitial } from '@/lib/utils'

export function DepartmentSwitcher({
  departments,
}: {
  departments: {
    name: string
    logo?: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeDepartment, setActiveDepartment] = React.useState(departments[0])

  if (!activeDepartment) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Logo />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
                <span className="truncate text-xs">{activeDepartment.name}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-sm">
              Departments
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {departments.map(department => (
              <DropdownMenuItem
                key={department.name}
                onClick={() => setActiveDepartment(department)}
                className="gap-2 p-2"
              >
                <div className="mr-2 flex size-6 items-center justify-center rounded-md border">
                  <Avatar>
                    <AvatarFallback>{getNameByInitial(department.name)}</AvatarFallback>
                  </Avatar>
                </div>
                {department.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Undo2 className="size-4" />
              </div>
              <div className="font-medium text-black" onClick={() => {}}>
                Switch to Super Admin
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
