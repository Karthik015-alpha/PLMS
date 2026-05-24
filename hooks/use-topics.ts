'use client'

import { useCallback, useState } from 'react'
import type {
  Topic,
  TopicCreatePayload,
  TopicUpdatePayload,
} from '@/types/topic'

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

function normalizeTopic(item: any): Topic {
  return {
    id: item.id,
    subjectId: item.subject_id ?? item.subjectId,
    title: item.name ?? item.title,
    status: item.metadata?.status ?? item.status ?? 'Not Started',
    estimatedHours: item.metadata?.estimated_hours ?? item.estimated_hours ?? item.estimatedHours,
    createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updated_at ?? item.updatedAt ?? new Date().toISOString(),
  }
}

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchTopics = useCallback(async (subjectId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/topics?subjectId=${encodeURIComponent(subjectId)}`)
      const result = await parseApiResponse<unknown[]>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to load topics.')
      }

      const normalized = Array.isArray(result.data)
        ? result.data.map((item) => normalizeTopic(item))
        : []
      setTopics(normalized)
      return normalized
    } catch (err) {
      setError((err as Error).message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTopic = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(id)}`)
      const result = await parseApiResponse<unknown>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to load topic.')
      }

      const normalized = normalizeTopic(result.data)
      setTopic(normalized)
      return normalized
    } catch (err) {
      setError((err as Error).message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createTopic = useCallback(async (payload: TopicCreatePayload) => {
    setActionLoading(true)
    setActionError(null)

    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await parseApiResponse<unknown>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to create topic.')
      }

      const normalized = normalizeTopic(result.data)
      setTopics((current) => [normalized, ...current])
      return normalized
    } catch (err) {
      setActionError((err as Error).message)
      return null
    } finally {
      setActionLoading(false)
    }
  }, [])

  const updateTopic = useCallback(async (id: string, payload: TopicUpdatePayload) => {
    setActionLoading(true)
    setActionError(null)

    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await parseApiResponse<unknown>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to update topic.')
      }

      const normalized = normalizeTopic(result.data)
      setTopic(normalized)
      setTopics((current) => current.map((item) => (item.id === id ? normalized : item)))
      // If the topic status changed to "In Progress", award 25% subject progress.
      try {
        const newStatus = payload.status ?? normalized.status
        if ((newStatus === 'In Progress' || newStatus === 'in progress') && normalized.subjectId) {
          void fetch('/api/progress/subject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subjectId: normalized.subjectId, value: 25 }),
          }).catch(() => {
            // non-fatal: ignore errors here
          })
        }
      } catch (e) {
        // ignore
      }
      return normalized
    } catch (err) {
      setActionError((err as Error).message)
      return null
    } finally {
      setActionLoading(false)
    }
  }, [])

  const deleteTopic = useCallback(async (id: string) => {
    setActionLoading(true)
    setActionError(null)

    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const result = await parseApiResponse<unknown>(response)

      if (!result.success) {
        throw new Error(result.error?.message ?? 'Unable to delete topic.')
      }

      setTopics((current) => current.filter((item) => item.id !== id))
      if (topic?.id === id) {
        setTopic(null)
      }
      return true
    } catch (err) {
      setActionError((err as Error).message)
      return false
    } finally {
      setActionLoading(false)
    }
  }, [topic])

  return {
    topics,
    topic,
    loading,
    actionLoading,
    error,
    actionError,
    fetchTopics,
    fetchTopic,
    createTopic,
    updateTopic,
    deleteTopic,
  }
}
