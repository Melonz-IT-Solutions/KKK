import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'

async function main() {
  console.log('🌱 Starting seed...')

  try {
    const hashedPassword = await bcrypt.hash('123123123', 10)

    const users = [
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

    for (const user of users) {
      const existingUser = await prisma.user.findUnique({
        where: {
          username: user.username,
        },
      })

      if (existingUser) {
        console.log(`✓ ${user.role} already exists`)
        continue
      }

      const createdUser = await prisma.user.create({
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

      console.log(`✓ Created ${createdUser.username} (${createdUser.roles})`)
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
