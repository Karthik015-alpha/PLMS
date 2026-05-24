'use client'

import { useCallback, useState } from 'react'
import type {
  Subject,
  SubjectCreatePayload,
  SubjectUpdatePayload,
} from '@/types/subject'

type ApiError = {
  code: string
  message: string
  field?: string
}

async function parseApiResponse<T>(response: Response) {
  const payload = await response.json().catch(() => null)
  if (!payload) {
    return { success: false, error: { code: 'invalid_response', message: 'Invalid server response.' } as ApiError }
  }

  if (payload.success) {
    return { success: true, data: payload.data as T }
  }

  return { success: false, error: payload.error as ApiError }
}

function normalizeSubject(item: any): Subject {
  return {
    id: item.id,
    title: item.name ?? item.title,
    description: item.description ?? undefined,
    progress: typeof item.progress === 'number' ? item.progress : 0,
    createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updated_at ?? item.updatedAt ?? new Date().toISOString(),
  }
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchSubjects = useCallback(async (ownerId?: string) => {
    setLoading(true)
    setError(null)

    try {
      const search = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : ''
      const response = await fetch(`/api/subjects${search}`)
      const result = await parseApiResponse<unknown[]>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to load subjects.')
      }

      const normalized = Array.isArray(result.data)
        ? result.data.map((item) => normalizeSubject(item))
        : []
      setSubjects(normalized)
      return normalized
    } catch (err) {
      setError((err as Error).message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSubject = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/subjects/${encodeURIComponent(id)}`)
      const result = await parseApiResponse<unknown>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to load subject.')
      }

      const normalized = normalizeSubject(result.data)
      setSubject(normalized)
      return normalized
    } catch (err) {
      setError((err as Error).message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createSubject = useCallback(async (payload: SubjectCreatePayload) => {
    setActionLoading(true)
    setActionError(null)

    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await parseApiResponse<unknown>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to create subject.')
      }

      const normalized = normalizeSubject(result.data)
      setSubjects((current) => [normalized, ...current])
      return normalized
    } catch (err) {
      setActionError((err as Error).message)
      return null
    } finally {
      setActionLoading(false)
    }
  }, [])

  const updateSubject = useCallback(async (id: string, payload: SubjectUpdatePayload) => {
    setActionLoading(true)
    setActionError(null)

    try {
      const response = await fetch(`/api/subjects/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await parseApiResponse<unknown>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to update subject.')
      }

      const normalized = normalizeSubject(result.data)
      setSubject(normalized)
      setSubjects((current) => current.map((item) => (item.id === id ? normalized : item)))
      return normalized
    } catch (err) {
      setActionError((err as Error).message)
      return null
    } finally {
      setActionLoading(false)
    }
  }, [])

  const deleteSubject = useCallback(async (id: string) => {
    setActionLoading(true)
    setActionError(null)

    try {
      const response = await fetch(`/api/subjects/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const result = await parseApiResponse<unknown>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to delete subject.')
      }

      setSubjects((current) => current.filter((item) => item.id !== id))
      if (subject?.id === id) {
        setSubject(null)
      }
      return true
    } catch (err) {
      setActionError((err as Error).message)
      return false
    } finally {
      setActionLoading(false)
    }
  }, [subject])

  return {
    subjects,
    subject,
    loading,
    actionLoading,
    error,
    actionError,
    fetchSubjects,
    fetchSubject,
    createSubject,
    updateSubject,
    deleteSubject,
  }
}
