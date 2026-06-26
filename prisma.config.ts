import { config } from 'dotenv'
import { resolve } from 'path'
import { defineConfig } from 'prisma/config'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'tsx ./prisma/seed.ts',
  },
})
