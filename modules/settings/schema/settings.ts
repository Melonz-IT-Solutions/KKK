import { z } from 'zod'

export const accountSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string(),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  contactNumber: z.string().min(1, 'Mobile number is required'),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type AccountFormData = z.infer<typeof accountSchema>
export type PasswordFormData = z.infer<typeof passwordSchema>
