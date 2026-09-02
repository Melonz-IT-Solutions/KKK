import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

const PERMISSIONS = {
  MEMBER_VIEW: { name: 'member:view', label: 'View Members', category: 'Members' },
  MEMBER_CREATE: { name: 'member:create', label: 'Create Members', category: 'Members' },
  MEMBER_IMPORT: { name: 'member:import', label: 'Import Members', category: 'Members' },
  MEMBER_EDIT: { name: 'member:edit', label: 'Edit Members', category: 'Members' },

  STAFF_CREATE: { name: 'staff:create', label: 'Create Staff', category: 'Staff' },
  STAFF_IMPORT: { name: 'staff:import', label: 'Import Staff', category: 'Staff' },
  STAFF_VIEW_ALL: { name: 'staff:view_all', label: 'View All Staff', category: 'Staff' },
  STAFF_VIEW_OWN_BRANCH: {
    name: 'staff:view_own_branch',
    label: 'View Own Branch Staff',
    category: 'Staff',
  },
  STAFF_CHANGE_PERMISSION: {
    name: 'staff:change_permission',
    label: 'Change Staff Permissions',
    category: 'Staff',
  },
  STAFF_RESET_PASSWORD: {
    name: 'staff:reset_password',
    label: 'Reset Staff Password',
    category: 'Staff',
  },
  STAFF_ACTIVATE: { name: 'staff:activate', label: 'Activate Staff', category: 'Staff' },
  STAFF_DEACTIVATE: { name: 'staff:deactivate', label: 'Deactivate Staff', category: 'Staff' },

  ACTIVITY_LOGS_VIEW: {
    name: 'activity_logs:view',
    label: 'View Activity Logs',
    category: 'Activity Logs',
  },

  SETTINGS_ACCESS: { name: 'settings:access', label: 'Access Settings', category: 'Settings' },

  REPORTS_VIEW: { name: 'reports:view', label: 'View Reports', category: 'Reports' },
  REPORTS_GENERATE: { name: 'reports:generate', label: 'Generate Reports', category: 'Reports' },
  REPORTS_DELETE: { name: 'reports:delete', label: 'Delete Reports', category: 'Reports' },

  CLUSTER_VIEW: { name: 'cluster:view', label: 'View Clusters', category: 'Clusters' },
} as const

const PERMISSIONS_LIST = Object.values(PERMISSIONS)

const ALL = PERMISSIONS_LIST.map(p => p.name)
const ALL_EXCEPT_ACTIVITY_LOGS = PERMISSIONS_LIST.map(p => p.name).filter(
  n => n !== PERMISSIONS.ACTIVITY_LOGS_VIEW.name
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
      PERMISSIONS.MEMBER_VIEW.name,
      PERMISSIONS.MEMBER_CREATE.name,
      PERMISSIONS.MEMBER_IMPORT.name,
      PERMISSIONS.STAFF_VIEW_OWN_BRANCH.name,
      PERMISSIONS.REPORTS_VIEW.name,
      PERMISSIONS.REPORTS_GENERATE.name,
      PERMISSIONS.SETTINGS_ACCESS.name,
      PERMISSIONS.CLUSTER_VIEW.name,
    ],
  },
  {
    name: 'FDO',
    label: 'Finance Department Officer',
    permissions: [
      PERMISSIONS.MEMBER_VIEW.name,
      PERMISSIONS.MEMBER_CREATE.name,
      PERMISSIONS.MEMBER_EDIT.name,
      PERMISSIONS.MEMBER_IMPORT.name,
      PERMISSIONS.REPORTS_VIEW.name,
      PERMISSIONS.REPORTS_GENERATE.name,
    ],
  },
  {
    name: 'OPERATIONS',
    label: 'Operations Director',
    permissions: [PERMISSIONS.MEMBER_VIEW.name, PERMISSIONS.REPORTS_VIEW.name],
  },
  {
    name: 'ADMIN_AND_HR',
    label: 'Admin and HR Director',
    permissions: [PERMISSIONS.MEMBER_VIEW.name, PERMISSIONS.REPORTS_VIEW.name],
  },
  {
    name: 'ACCOUNTING',
    label: 'Accounting Dept Head',
    permissions: [PERMISSIONS.MEMBER_VIEW.name, PERMISSIONS.REPORTS_VIEW.name],
  },
  {
    name: 'AUDIT_DEPARTMENT',
    label: 'Audit Department',
    permissions: [PERMISSIONS.MEMBER_VIEW.name, PERMISSIONS.REPORTS_VIEW.name],
  },
  {
    name: 'BRANCH_MANAGER',
    label: 'Branch Manager',
    permissions: [PERMISSIONS.MEMBER_VIEW.name],
  },
  {
    name: 'GUEST',
    label: 'Guest',
    permissions: [PERMISSIONS.MEMBER_VIEW.name],
  },
]

// ---------------------------------------------------------------------------
// Clusters & Branches
// ---------------------------------------------------------------------------

const CLUSTERS = [
  {
    name: 'Zamboanga City Proper',
    branches: ['Putik', 'Sta Catalina', 'Talon-Talon', 'Tetuan'],
  },
  {
    name: 'Zamboanga East Coast',
    branches: ['Cabaluay', 'Mercedes', 'Sangali', 'Vitali'],
  },
  {
    name: 'Zamboanga West Coast',
    branches: ['Maasin', 'Sinunuc', 'Sta Maria', 'Talisayan'],
  },
  {
    name: 'Zamboanga Sibugay',
    branches: ['Buug', 'Imelda', 'Kabasalan'],
  },
  {
    name: 'Zamboanga del Norte',
    branches: ['Ipil', 'Liloy', 'Siocon'],
  },
  {
    name: 'BaSulTa',
    branches: ['Bongao', 'Isabela', 'Lamitan'],
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
    department: 'President & CEO',
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
    for (const perm of PERMISSIONS_LIST) {
      await prisma.permission.upsert({
        where: { name: perm.name },
        create: perm,
        update: { label: perm.label, category: perm.category },
      })
    }
    console.log(`  ✓ ${PERMISSIONS_LIST.length} permissions seeded`)

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
    const hashedPassword = await bcrypt.hash('superadmin@kkk2026', 10)
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
          role: user.role,
          department: user.department,
          active: true,
          isDeleted: false,
        },
      })
      console.log(`  ✓ Created user ${user.username} (${user.role})`)
    }

    // Upsert clusters and branches
    console.log('  → Seeding clusters and branches...')
    for (const clusterData of CLUSTERS) {
      const cluster = await prisma.cluster.upsert({
        where: { name: clusterData.name },
        create: { name: clusterData.name },
        update: {},
      })
      for (const branchName of clusterData.branches) {
        await prisma.branch.upsert({
          where: { name: branchName },
          create: { name: branchName, clusterId: cluster.id },
          update: { clusterId: cluster.id },
        })
      }
      console.log(`  ✓ Cluster ${clusterData.name} (${clusterData.branches.length} branches)`)
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
