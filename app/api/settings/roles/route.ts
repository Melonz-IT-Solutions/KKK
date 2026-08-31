import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  PERMISSIONS,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  ROLES,
  type StaffRole,
} from '@/lib/auth/permissions'

// Static fallback used when DB tables don't exist yet (pre-migration)
const STATIC_PERMISSIONS = [
  { name: 'member:view', label: 'View Members', category: 'Members' },
  { name: 'member:create', label: 'Create Members', category: 'Members' },
  { name: 'member:import', label: 'Import Members', category: 'Members' },
  { name: 'staff:create', label: 'Create Staff', category: 'Staff' },
  { name: 'staff:import', label: 'Import Staff', category: 'Staff' },
  { name: 'staff:view_all', label: 'View All Staff', category: 'Staff' },
  { name: 'staff:view_own_branch', label: 'View Own Branch Staff', category: 'Staff' },
  { name: 'staff:change_permission', label: 'Change Staff Permissions', category: 'Staff' },
  { name: 'staff:reset_password', label: 'Reset Staff Password', category: 'Staff' },
  { name: 'staff:activate', label: 'Activate Staff', category: 'Staff' },
  { name: 'staff:deactivate', label: 'Deactivate Staff', category: 'Staff' },
  { name: 'activity_logs:view', label: 'View Activity Logs', category: 'Activity Logs' },
  { name: 'settings:access', label: 'Access Settings', category: 'Settings' },
  { name: 'reports:view', label: 'View Reports', category: 'Reports' },
  { name: 'reports:generate', label: 'Generate Reports', category: 'Reports' },
  { name: 'reports:delete', label: 'Delete Reports', category: 'Reports' },
]

function buildStaticResponse() {
  const configurableRoles = ROLES.filter(r => r !== 'SUPER_ADMIN')
  return {
    roles: configurableRoles.map(name => ({
      name,
      label: ROLE_LABELS[name],
      permissions: [...ROLE_PERMISSIONS[name]],
    })),
    allPermissions: STATIC_PERMISSIONS,
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(prisma as any).role) {
      return NextResponse.json(buildStaticResponse())
    }

    const [roles, allPermissions] = await Promise.all([
      prisma.role.findMany({
        where: { name: { not: 'SUPER_ADMIN' } },
        include: { permissions: { select: { name: true } } },
        orderBy: { id: 'asc' },
      }),
      prisma.permission.findMany({ orderBy: { id: 'asc' } }),
    ])

    return NextResponse.json({
      roles: roles.map(r => ({
        name: r.name,
        label: r.label,
        permissions: r.permissions.map(p => p.name),
      })),
      allPermissions,
    })
  } catch (error) {
    console.error('GET /api/settings/roles error:', error)
    try {
      return NextResponse.json(buildStaticResponse())
    } catch {
      return NextResponse.json({ message: 'Failed to load role permissions 1' }, { status: 500 })
    }
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const role = body.role as StaffRole
    const permissions = body.permissions as string[]

    if (role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { message: 'Cannot modify Super Admin permissions' },
        { status: 400 }
      )
    }

    const validPermissions = permissions.filter(p => (PERMISSIONS as readonly string[]).includes(p))

    await prisma.role.update({
      where: { name: role },
      data: {
        permissions: {
          set: validPermissions.map(name => ({ name })),
        },
      },
    })

    return NextResponse.json({ message: 'Permissions updated successfully' })
  } catch (error) {
    console.error('PUT /api/settings/roles error:', error)
    return NextResponse.json({ message: 'Failed to update role permissions' }, { status: 500 })
  }
}
