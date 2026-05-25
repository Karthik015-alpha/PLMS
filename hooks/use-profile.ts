'use client'

import { useEffect, useState, useCallback } from 'react'

export type UserProfile = {
  id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  metadata: Record<string, any> | null
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/users/profile')
      const payload = await response.json().catch(() => null)

      if (response.ok && payload?.success && payload?.data) {
        setProfile(payload.data as UserProfile)
      } else {
        throw new Error(payload?.error?.message || 'Failed to fetch profile data.')
      }
    } catch (err) {
      setError((err as Error).message)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (displayName: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName }),
      })
      const payload = await response.json().catch(() => null)

      if (response.ok && payload?.success && payload?.data) {
        const updated = payload.data as UserProfile
        setProfile(updated)
        return updated
      } else {
        throw new Error(payload?.error?.message || 'Failed to update profile.')
      }
    } catch (err) {
      setError((err as Error).message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetchProfile: fetchProfile,
  }
}

export default useProfile
