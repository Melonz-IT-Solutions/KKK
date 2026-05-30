import { prisma } from './lib/prisma'

async function main() {
  const users = await prisma.user.findMany()
  console.log('Users in database:', users)
  console.log('Total users:', users.length)
}

main()
  .catch(e => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
