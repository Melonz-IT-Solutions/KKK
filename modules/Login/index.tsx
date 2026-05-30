'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LoginForm from '@/components/form/login-form'
import { LoginFormValues } from '@/lib/validation/login'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true)
    setAuthError(null)
    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      })

      console.log('signIn result', result)

      if (result?.error) {
        setAuthError('Invalid username or password')
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left column: green background */}
      <div className="from-tertiary to-primary hidden flex-1 flex-col items-center justify-center bg-linear-to-b text-white md:flex">
        <img src="/logos/Margin.png" alt="Logo" className="h-40 w-40 object-contain" />
        <p className="text-48 w-[70%] text-center font-bold">
          Empowering Communities, Building Futures
        </p>
        <div className="bg-secondary mt-4 h-1.5 w-32.5" />
      </div>
      {/* Right column: login form */}
      <div className="text flex flex-1 flex-col items-center justify-center space-y-12">
        <div className="w-full text-center">
          <h1 className="text-primary text-48 text-3xl font-bold">Welcome Back!</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your details to access your dashboard
          </p>
        </div>
        <LoginForm key={pathname} loading={loading} onSubmit={handleLogin} authError={authError} />
      </div>
    </div>
  )
}

export default Login
