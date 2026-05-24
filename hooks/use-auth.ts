'use client'

import { useEffect, useState, useCallback } from 'react'
import type { AppUser } from '../types/auth'

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session')
      const payload = await response.json()

      if (response.ok && payload?.success && payload.data?.user) {
        const userData = payload.data.user
        setUser({
          id: userData.id,
          email: userData.email ?? null,
          fullName: userData.display_name ?? null,
        })
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  return { user, loading }
}

export default useAuth
