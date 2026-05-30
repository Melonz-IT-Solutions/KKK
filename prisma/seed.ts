import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'

async function main() {
  console.log('🌱 Starting seed...')

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'superadmin' },
    })

    if (existingAdmin) {
      console.log('✓ Super-admin user already exists')
      return
    }

    const hashedPassword = await bcrypt.hash('123123123', 10)

    const superAdmin = await prisma.user.create({
      data: {
        name: 'super-admin',
        email: 'super-admin@kkk.com',
        contact_no: '123',
        username: 'superadmin',
        password: hashedPassword,
        roles: 'super-admin',
        active: true,
        is_deleted: false,
        departments: ['Finance'],
      },
    })

    console.log('✓ Super-admin user created:', superAdmin.username)
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
