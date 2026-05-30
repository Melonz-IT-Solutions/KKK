'use client'

import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/form/form'
import Input from '@/components/input'
import Button from '@/components/button'
import { LockKeyhole, Eye, EyeOff, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { loginSchema } from '@/lib/validation/login'

type LoginFormValues = z.infer<typeof loginSchema>

type Props = {
  loading?: boolean
  onSubmit: (data: LoginFormValues) => void | Promise<void>
  authError?: string | null
}

export default function LoginForm({ loading, onSubmit, authError }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  useEffect(() => {
    form.reset()
  }, [])

  return (
    <Form form={form} className="w-87.5" onSubmit={onSubmit}>
      <div className="space-y-4">
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium">
                Username
              </label>
              <Input
                {...field}
                startIcon={<User className="text-primary" />}
                id="username"
                type="text"
                size="lg"
                placeholder="Enter your username"
                autoComplete="username"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <p className="mt-1 text-xs text-red-600">{fieldState.error?.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                Password
              </label>
              <Input
                {...field}
                size="lg"
                startIcon={<LockKeyhole className="text-primary" />}
                endIcon={
                  showPassword ? (
                    <EyeOff
                      className="cursor-pointer text-gray-700"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="cursor-pointer text-gray-700"
                      onClick={() => setShowPassword(true)}
                    />
                  )
                }
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <p className="mt-1 text-xs text-red-600">{fieldState.error?.message}</p>
              )}
            </div>
          )}
        />
        {authError && (
          <div className="text-left">
            <p className="text-xs text-red-600">{authError}</p>
          </div>
        )}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting || loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </Form>
  )
}
