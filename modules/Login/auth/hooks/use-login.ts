'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'

import type { LoginFormValues } from '@/lib/validation/login'

export function useLogin() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [authError, setAuthError] = useState<string | null>(null)

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true)
    setAuthError(null)

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setAuthError('Invalid username or password')

        return
      }

      if (result?.ok) {
        const session = await getSession()

        if (session?.user?.mustChangePassword) {
          router.replace('/setup-password')
        } else {
          router.replace('/dashboard')
        }
      }
    } catch (error) {
      console.error('Login failed:', error)

      setAuthError('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    authError,
    handleLogin,
  }
}
