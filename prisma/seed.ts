import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcrypt'

async function main() {
  // Check if super-admin user exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'superadmin' },
  })

  if (existingAdmin) {
    return
  }

  // Create super-admin user
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
}

main()
  .catch(e => {
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
