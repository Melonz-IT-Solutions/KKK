'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { LockKeyhole, Eye, EyeOff } from 'lucide-react'

import Input from '@/components/input'
import Button from '@/components/button'

export default function SetupPasswordPage() {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  if (session && !session.user?.mustChangePassword) {
    router.replace('/dashboard')
    return null
  }

  const validate = () => {
    const next: { password?: string; confirmPassword?: string } = {}

    if (!password) {
      next.password = 'Password is required.'
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters.'
    }

    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your password.'
    } else if (password !== confirmPassword) {
      next.confirmPassword = 'Passwords do not match.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading || !validate()) return

    setLoading(true)
    setServerError(null)

    try {
      const res = await fetch('/api/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.message ?? 'Failed to update password.')
        return
      }

      // Refresh session so mustChangePassword becomes false
      await updateSession({ mustChangePassword: false })

      router.replace('/dashboard')
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left column */}
      <div className="from-tertiary to-primary hidden flex-1 flex-col items-center justify-center bg-linear-to-b text-white md:flex">
        <img src="/logos/Margin.png" alt="Logo" className="h-40 w-40 object-contain" />

        <p className="text-48 w-[70%] text-center font-bold">
          Empowering Communities, Building Futures
        </p>

        <div className="bg-secondary mt-4 h-1.5 w-32.5" />
      </div>

      {/* Right column */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-12">
        <div className="w-full text-center">
          <h1 className="text-primary text-3xl font-bold">Setup Your Password</h1>

          <p className="mt-2 text-sm text-gray-600">
            Create a new password to secure your account.
          </p>
        </div>

        <form onSubmit={e => void handleSubmit(e)} className="w-87.5 space-y-4">
          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              size="lg"
              placeholder="Enter new password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setErrors(prev => ({ ...prev, password: undefined }))
              }}
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
              aria-invalid={!!errors.password}
              disabled={loading}
            />

            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
              Confirm Password
            </label>

            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              size="lg"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value)
                setErrors(prev => ({ ...prev, confirmPassword: undefined }))
              }}
              startIcon={<LockKeyhole className="text-primary" />}
              endIcon={
                showConfirm ? (
                  <EyeOff
                    className="cursor-pointer text-gray-700"
                    onClick={() => setShowConfirm(false)}
                  />
                ) : (
                  <Eye
                    className="cursor-pointer text-gray-700"
                    onClick={() => setShowConfirm(true)}
                  />
                )
              }
              aria-invalid={!!errors.confirmPassword}
              disabled={loading}
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-red-600">{serverError}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  )
}
