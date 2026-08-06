// import { config } from 'dotenv'
// import { resolve } from 'path'
// import { defineConfig } from 'prisma/config'

// // Load .env.local
// config({ path: resolve(process.cwd(), '.env.local') })

// export default defineConfig({
//   migrations: {
//     seed: 'tsx ./prisma/seed.ts',
//   },
// })

import { config } from 'dotenv'
import { resolve } from 'path'
import { defineConfig } from 'prisma/config'

config({ path: resolve(process.cwd(), '.env.local') })

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgres://f948e1033416fcd542f040fadd38c569784cb81d72e16e7fbe04b74df5254535:sk__ILqr4cvDWj7QYbEDYHiX@pooled.db.prisma.io:5432/postgres?sslmode=require'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx ./prisma/seed.ts',
  },
  // Prisma 7 expects the datasource URL to be passed through the config object.
  datasource: {
    url: databaseUrl,
  },
})
