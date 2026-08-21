'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { LockKeyhole, Eye, EyeOff, User } from 'lucide-react'

import { Form } from '@/components/form/form'
import Input from '@/components/input'
import Button from '@/components/button'

import { loginSchema, type LoginFormValues } from '@/lib/validation/login'

interface LoginFormProps {
  loading?: boolean
  onSubmit: (data: LoginFormValues) => void | Promise<void>
  authError?: string | null
}

export default function LoginForm({ loading, onSubmit, authError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  return (
    <Form form={form} className="w-87.5" onSubmit={onSubmit}>
      <div className="space-y-4">
        {/* Username */}
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
                id="username"
                type="text"
                size="lg"
                placeholder="Enter your username"
                autoComplete="username"
                startIcon={<User className="text-primary" />}
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <p className="mt-1 text-xs text-red-600">{fieldState.error?.message}</p>
              )}
            </div>
          )}
        />

        {/* Password */}
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
                id="password"
                type={showPassword ? 'text' : 'password'}
                size="lg"
                placeholder="Enter your password"
                autoComplete="current-password"
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
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <p className="mt-1 text-xs text-red-600">{fieldState.error?.message}</p>
              )}
            </div>
          )}
        />

        {/* Authentication Error */}
        {authError && (
          <div className="text-left">
            <p className="text-xs text-red-600">{authError}</p>
          </div>
        )}

        {/* Login Button */}
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
