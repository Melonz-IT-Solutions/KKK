import { z } from 'zod'

export const statusFilterSchema = z.enum(['all', 'active', 'inactive'])

export type StatusFilter = z.infer<typeof statusFilterSchema>

export const memberQuerySchema = z.object({
  pageSize: z.coerce.number().int().positive().max(1000).default(1000),

  search: z.string().default(''),

  branch: z.string().default('all'),

  status: statusFilterSchema.default('active'),
})

export type MemberQuery = z.infer<typeof memberQuerySchema>
