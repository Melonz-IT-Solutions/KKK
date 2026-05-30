import { z } from 'zod'
import { FIELD_IS_REQUIRED } from '@/constants/message'

export const loginSchema = z.object({
  username: z.string().min(1, FIELD_IS_REQUIRED),
  password: z.string().min(1, FIELD_IS_REQUIRED),
})

export type LoginFormValues = z.infer<typeof loginSchema>
