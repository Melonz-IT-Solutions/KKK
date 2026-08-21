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

import { ChevronsUpDown, Undo2, Wallet, Users, Building2 } from 'lucide-react'

import Logo from '../logo'

import { ROLE_LABELS, type ActiveRole } from '@/lib/auth/permissions'

interface RoleOption {
  value: ActiveRole
  name: string
  description: string
  icon: React.ComponentType<{
    className?: string
  }>
}

interface DepartmentSwitcherProps {
  activeRole: ActiveRole | null
  realRole: ActiveRole | null
  onRoleChange: (role: ActiveRole) => void
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'FINANCE',
    name: 'Finance',
    description: 'Finance department',
    icon: Wallet,
  },
  {
    value: 'STAFF',
    name: 'MIS',
    description: 'Staff / MIS department',
    icon: Users,
  },
  {
    value: 'BRANCH_MANAGER',
    name: 'Branch Manager',
    description: 'Branch management',
    icon: Building2,
  },
]

export function DepartmentSwitcher({
  activeRole,
  realRole,
  onRoleChange,
}: DepartmentSwitcherProps) {
  const { isMobile } = useSidebar()

  const [changing, setChanging] = React.useState(false)

  const selectedRole = activeRole ?? realRole ?? 'SUPER_ADMIN'

  const selectedName = ROLE_LABELS[selectedRole]

  const handleRoleChange = async (role: ActiveRole) => {
    if (changing || role === activeRole || realRole !== 'SUPER_ADMIN') {
      return
    }

    try {
      setChanging(true)

      const response = await fetch('/api/auth/active-role', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? 'Failed to switch role')
      }

      onRoleChange(role)
    } catch (error) {
      console.error('Failed to switch role:', error)
    } finally {
      setChanging(false)
    }
  }

  if (realRole !== 'SUPER_ADMIN') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip={selectedName}>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Logo />
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>

              <span className="truncate text-xs">{selectedName}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              disabled={changing}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Logo />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>

                <span className="truncate text-xs">{selectedName}</span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-sm">
              Select Department
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {ROLE_OPTIONS.map(role => {
              const Icon = role.icon
              const isSelected = activeRole === role.value

              return (
                <DropdownMenuItem
                  key={role.value}
                  disabled={changing}
                  onClick={() => handleRoleChange(role.value)}
                  className={`cursor-pointer gap-2 p-2 ${
                    isSelected
                      ? 'bg-green-50 text-green-700 focus:bg-green-50 focus:text-green-700'
                      : ''
                  }`}
                >
                  <div
                    className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${
                      isSelected ? 'border-green-200 bg-green-100 text-green-700' : 'border-border'
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{role.name}</span>

                    <span
                      className={`text-xs ${
                        isSelected ? 'text-green-600' : 'text-muted-foreground'
                      }`}
                    >
                      {role.description}
                    </span>
                  </div>
                </DropdownMenuItem>
              )
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={changing}
              onClick={() => handleRoleChange('SUPER_ADMIN')}
              className={`cursor-pointer gap-2 p-2 ${
                activeRole === 'SUPER_ADMIN'
                  ? 'bg-green-50 text-green-700 focus:bg-green-50 focus:text-green-700'
                  : ''
              }`}
            >
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${
                  activeRole === 'SUPER_ADMIN'
                    ? 'border-green-200 bg-green-100 text-green-700'
                    : 'border-border'
                }`}
              >
                <Undo2 className="size-4" />
              </div>

              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Super Admin</span>

                <span
                  className={`text-xs ${
                    activeRole === 'SUPER_ADMIN' ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                >
                  Full system access
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
