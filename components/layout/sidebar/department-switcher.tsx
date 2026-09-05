'use client'

import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { ChevronsUpDown, Undo2, Wallet, Users, Building2, Network, UserCheck } from 'lucide-react'

import Logo from '../logo'

import { ROLE_LABELS, isStaffRole, type ActiveRole } from '@/lib/auth/permissions'
import { useRoleStore } from '@/lib/stores/role-store'

interface RoleOption {
  value: ActiveRole
  name: string
  description: string
  icon: React.ComponentType<{
    className?: string
  }>
}

interface RoleApiItem {
  name: string
  label: string
}

const ROLE_ICONS: Partial<Record<ActiveRole, React.ComponentType<{ className?: string }>>> = {
  FINANCE: Wallet,
  MIS: Users,
  CLUSTER_MANAGER: Network,
  BRANCH_MANAGER: Building2,
  FDO: UserCheck,
  GUEST: Users,
}

const DEFAULT_ROLE_ICON = Building2

export function DepartmentSwitcher() {
  const { isMobile } = useSidebar()

  const {
    activeRole,
    realRole,
    activeEntityName,
    clusters,
    setActiveRole,
    setActiveEntityName,
    setPermissions,
  } = useRoleStore()

  const [changing, setChanging] = React.useState(false)
  const [roleOptions, setRoleOptions] = React.useState<RoleOption[]>([])

  const selectedRole = activeRole ?? realRole ?? 'SUPER_ADMIN'

  const formatRole = (role: string | null): string => {
    if (!role) {
      return ''
    }

    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const selectedName = activeEntityName
    ? `${ROLE_LABELS[selectedRole]} (${activeEntityName})`
    : formatRole(activeRole)

  // Fetch available role options (only needed for SUPER_ADMIN)
  React.useEffect(() => {
    if (realRole !== 'SUPER_ADMIN') {
      return
    }

    let cancelled = false

    fetch('/api/settings/roles', { cache: 'no-store' })
      .then(async response => {
        const data = await response.json()

        if (!response.ok || !Array.isArray(data.roles)) {
          throw new Error(data.message ?? 'Failed to load roles')
        }

        return data.roles as RoleApiItem[]
      })
      .then(roles => {
        if (cancelled) {
          return
        }

        const options = roles
          .filter(
            role =>
              isStaffRole(role.name) &&
              (role.name === 'FINANCE' ||
                role.name === 'MIS' ||
                role.name === 'CLUSTER_MANAGER' ||
                role.name === 'BRANCH_MANAGER')
          )
          .map(role => ({
            value: role.name as ActiveRole,
            name: role.label,
            description: `${role.label} Department`,
            icon: ROLE_ICONS[role.name as ActiveRole] ?? DEFAULT_ROLE_ICON,
          }))

        setRoleOptions(options)
      })
      .catch(error => {
        console.error('Failed to load department roles:', error)
      })

    return () => {
      cancelled = true
    }
  }, [realRole])

  const handleRoleChange = async (role: ActiveRole, entityId?: number) => {
    const isEntityRole = role === 'CLUSTER_MANAGER' || role === 'BRANCH_MANAGER'

    if (changing || realRole !== 'SUPER_ADMIN' || (role === activeRole && !isEntityRole)) {
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
          ...(role === 'CLUSTER_MANAGER' && entityId ? { clusterId: entityId } : {}),
          ...(role === 'BRANCH_MANAGER' && entityId ? { branchId: entityId } : {}),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? 'Failed to switch role')
      }
      // Update store with the new active role and entity
      setActiveRole(role)
      setActiveEntityName(data.entityName ?? null)

      // Refresh permissions for the new role
      const permResponse = await fetch('/api/auth/active-role', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      })

      if (permResponse.ok) {
        const permData = await permResponse.json()

        if (permData.success) {
          setPermissions(permData.permissions ?? [])
        }
      }

      window.location.reload()
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

            {roleOptions.map(role => {
              const Icon = role.icon
              const isSelected = activeRole === role.value

              const itemContent = (
                <>
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
                </>
              )

              const itemClassName = `cursor-pointer gap-2 p-2 ${
                isSelected
                  ? 'bg-green-50 text-green-700 focus:bg-green-50 focus:text-green-700'
                  : ''
              }`

              if (role.value === 'CLUSTER_MANAGER') {
                return (
                  <DropdownMenuSub key={role.value}>
                    <DropdownMenuSubTrigger disabled={changing} className={itemClassName}>
                      {itemContent}
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent className="min-w-56 rounded-lg">
                      <DropdownMenuLabel className="text-muted-foreground text-sm">
                        Select Cluster
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      {clusters.length === 0 ? (
                        <DropdownMenuItem disabled className="text-muted-foreground text-sm">
                          No clusters found
                        </DropdownMenuItem>
                      ) : (
                        clusters.map(cluster => {
                          const isClusterSelected = isSelected && activeEntityName === cluster.name

                          return (
                            <DropdownMenuItem
                              key={cluster.id}
                              disabled={changing}
                              onClick={() => handleRoleChange('CLUSTER_MANAGER', cluster.id)}
                              className={`cursor-pointer gap-2 p-2 text-sm ${
                                isClusterSelected
                                  ? 'bg-green-50 text-green-700 focus:bg-green-50 focus:text-green-700'
                                  : ''
                              }`}
                            >
                              {cluster.name}
                            </DropdownMenuItem>
                          )
                        })
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )
              }

              if (role.value === 'BRANCH_MANAGER') {
                return (
                  <DropdownMenuSub key={role.value}>
                    <DropdownMenuSubTrigger disabled={changing} className={itemClassName}>
                      {itemContent}
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent className="[&::-webkit-scrollbar-thumb]:bg-border h-72 min-w-56 scrollbar-thin [scrollbar-color:var(--border)_transparent] overflow-y-auto rounded-lg [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                      <DropdownMenuLabel className="text-muted-foreground text-sm">
                        Select Branch
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      {clusters.every(cluster => cluster.branches.length === 0) ? (
                        <DropdownMenuItem disabled className="text-muted-foreground text-sm">
                          No branches found
                        </DropdownMenuItem>
                      ) : (
                        clusters.map(cluster =>
                          cluster.branches.length === 0 ? null : (
                            <React.Fragment key={cluster.id}>
                              {cluster.branches.map(branch => {
                                const isBranchSelected =
                                  isSelected && activeEntityName === branch.name

                                return (
                                  <DropdownMenuItem
                                    key={branch.id}
                                    disabled={changing}
                                    onClick={() => handleRoleChange('BRANCH_MANAGER', branch.id)}
                                    className={`cursor-pointer gap-2 p-2 pl-4 text-sm ${
                                      isBranchSelected
                                        ? 'bg-green-50 text-green-700 focus:bg-green-50 focus:text-green-700'
                                        : ''
                                    }`}
                                  >
                                    {branch.name}
                                  </DropdownMenuItem>
                                )
                              })}
                            </React.Fragment>
                          )
                        )
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )
              }

              return (
                <DropdownMenuItem
                  key={role.value}
                  disabled={changing}
                  onClick={() => handleRoleChange(role.value)}
                  className={itemClassName}
                >
                  {itemContent}
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
