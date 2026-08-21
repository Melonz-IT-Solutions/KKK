'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import LoginForm from '@/modules/Login/components/login-form'
import { useLogin } from '@/modules/Login/auth/hooks/use-login'

export default function Login() {
  const router = useRouter()

  const { status } = useSession()

  const { loading, authError, handleLogin } = useLogin()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  if (status === 'loading' || status === 'authenticated') {
    return null
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
      <div className="text flex flex-1 flex-col items-center justify-center space-y-12">
        <div className="w-full text-center">
          <h1 className="text-primary text-48 text-3xl font-bold">Welcome Back!</h1>

          <p className="mt-2 text-sm text-gray-600">
            Please enter your details to access your dashboard
          </p>
        </div>

        <LoginForm loading={loading} onSubmit={handleLogin} authError={authError} />
      </div>
    </div>
  )
}
