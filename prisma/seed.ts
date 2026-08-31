import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

const PERMISSIONS = [
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

const ALL = PERMISSIONS.map(p => p.name)
const ALL_EXCEPT_ACTIVITY_LOGS = PERMISSIONS.map(p => p.name).filter(
  n => n !== 'activity_logs:view'
)

// ---------------------------------------------------------------------------
// Roles & default permission assignments
// ---------------------------------------------------------------------------

const ROLES = [
  {
    name: 'SUPER_ADMIN',
    label: 'Super Admin',
    permissions: ALL,
  },
  {
    name: 'FINANCE',
    label: 'Finance',
    permissions: ALL_EXCEPT_ACTIVITY_LOGS,
  },
  {
    name: 'MIS',
    label: 'MIS',
    permissions: ALL_EXCEPT_ACTIVITY_LOGS,
  },
  {
    name: 'CLUSTER_MANAGER',
    label: 'Cluster Manager',
    permissions: [
      'member:view',
      'member:create',
      'member:import',
      'staff:view_own_branch',
      'reports:view',
      'reports:generate',
      'settings:access',
    ],
  },
  {
    name: 'BRANCH_MANAGER',
    label: 'Branch Manager',
    permissions: ['member:view'],
  },
  {
    name: 'FDO',
    label: 'FDO',
    permissions: ['member:view', 'member:create'],
  },
  {
    name: 'GUEST',
    label: 'Guest',
    permissions: ['member:view'],
  },
]

// ---------------------------------------------------------------------------
// Default users
// ---------------------------------------------------------------------------

const USERS = [
  {
    name: 'Super Admin',
    email: 'super-admin@kkk.com',
    username: 'superadmin',
    contactNo: '09123456789',
    role: 'SUPER_ADMIN',
    department: 'Central Operations',
  },
  {
    name: 'Finance User',
    email: 'finance@kkk.com',
    username: 'finance',
    contactNo: '09123456780',
    role: 'FINANCE',
    department: 'Finance',
  },
  {
    name: 'Branch Manager',
    email: 'manager@kkk.com',
    username: 'branchmanager',
    contactNo: '09123456781',
    role: 'BRANCH_MANAGER',
    department: 'Branch Management',
  },
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱 Starting seed...')

  try {
    // Upsert all permissions
    console.log('  → Seeding permissions...')
    for (const perm of PERMISSIONS) {
      await prisma.permission.upsert({
        where: { name: perm.name },
        create: perm,
        update: { label: perm.label, category: perm.category },
      })
    }
    console.log(`  ✓ ${PERMISSIONS.length} permissions seeded`)

    // Upsert all roles with their permission connections
    console.log('  → Seeding roles...')
    for (const role of ROLES) {
      await prisma.role.upsert({
        where: { name: role.name },
        create: {
          name: role.name,
          label: role.label,
          permissions: {
            connect: role.permissions.map(name => ({ name })),
          },
        },
        update: {
          label: role.label,
          permissions: {
            set: role.permissions.map(name => ({ name })),
          },
        },
      })
      console.log(`  ✓ Role ${role.label} (${role.permissions.length} permissions)`)
    }

    // Upsert default users
    const hashedPassword = await bcrypt.hash('123123123', 10)
    console.log('  → Seeding users...')
    for (const user of USERS) {
      const existing = await prisma.user.findUnique({ where: { username: user.username } })
      if (existing) {
        console.log(`  ✓ User ${user.username} already exists`)
        continue
      }
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          contactNo: user.contactNo,
          username: user.username,
          password: hashedPassword,
          roles: user.role,
          active: true,
          isDeleted: false,
          departments: [user.department],
        },
      })
      console.log(`  ✓ Created user ${user.username} (${user.role})`)
    }

    console.log('🌱 Seed completed successfully')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch(error => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
