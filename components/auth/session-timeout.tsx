'use client'

import { useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'

const IDLE_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export default function SessionTimeout() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const logoutUser = () => {
      signOut({
        callbackUrl: '/login',
      })
    }

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(logoutUser, IDLE_TIMEOUT)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const

    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true })
    })

    // Start the timer immediately
    resetTimer()

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer)
      })

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return null
}
