'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSubjects } from '@/hooks/use-subjects'
import type { Note } from '@/types/note'
import type { Subject } from '@/types/subject'
import { TOPIC_STATUS_VALUES, type TopicStatus } from '@/types/topic'

export type StudyDeskTopicItem = {
  id: string
  title: string
  status: TopicStatus
  estimatedHours?: number
  notes: Note[]
}

export type StudyDeskTopicsBySubject = Record<string, StudyDeskTopicItem[]>

type ApiError = {
  code: string
  message: string
}

type TopicApiItem = {
  id?: unknown
  name?: unknown
  title?: unknown
  status?: unknown
  estimated_hours?: unknown
  estimatedHours?: unknown
  metadata?: {
    status?: unknown
    estimated_hours?: unknown
  } | null
}

type NoteApiItem = {
  id?: unknown
  subjectId?: unknown
  topicId?: unknown
  title?: unknown
  type?: unknown
  content?: unknown
  fileUrl?: unknown
  createdAt?: unknown
  updatedAt?: unknown
}

const TOPIC_STATUS_SET = new Set<TopicStatus>(TOPIC_STATUS_VALUES)

function parseApiResponse<T>(payload: unknown): { success: true; data: T } | { success: false; error: ApiError } {
  if (!payload || typeof payload !== 'object') {
    return { success: false, error: { code: 'invalid_response', message: 'Invalid server response.' } }
  }

  const response = payload as { success?: unknown; data?: unknown; error?: unknown }

  if (response.success) {
    return { success: true, data: response.data as T }
  }

  const error = response.error as ApiError | undefined
  return {
    success: false,
    error: error ?? { code: 'unknown_error', message: 'Unable to load study desk data.' },
  }
}

function normalizeTopicStatus(value: unknown): TopicStatus {
  return TOPIC_STATUS_SET.has(value as TopicStatus) ? (value as TopicStatus) : 'Not Started'
}

function normalizeTopic(item: TopicApiItem): StudyDeskTopicItem {
  const topicId = typeof item.id === 'string' ? item.id : ''
  const title = typeof item.name === 'string'
    ? item.name
    : typeof item.title === 'string'
      ? item.title
      : 'Untitled topic'

  const metadata = item.metadata ?? null
  const estimatedHoursValue =
    typeof metadata?.estimated_hours === 'number'
      ? metadata.estimated_hours
      : typeof item.estimated_hours === 'number'
        ? item.estimated_hours
        : typeof item.estimatedHours === 'number'
          ? item.estimatedHours
          : undefined

  return {
    id: topicId,
    title,
    status: normalizeTopicStatus(metadata?.status ?? item.status),
    estimatedHours: estimatedHoursValue,
    notes: [],
  }
}

function normalizeNote(item: NoteApiItem): Note | null {
  const id = typeof item.id === 'string' ? item.id : null
  const subjectId = typeof item.subjectId === 'string' ? item.subjectId : null
  const topicId = typeof item.topicId === 'string' ? item.topicId : null
  const title = typeof item.title === 'string' ? item.title : null
  const type = item.type === 'txt' || item.type === 'md' || item.type === 'pdf' || item.type === 'doc' ? item.type : null

  if (!id || !subjectId || !topicId || !title || !type) {
    return null
  }

  return {
    id,
    subjectId,
    topicId,
    title,
    type,
    content: typeof item.content === 'string' ? item.content : null,
    fileUrl: typeof item.fileUrl === 'string' ? item.fileUrl : null,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
  }
}

async function fetchStudyDeskTopics(subjectId: string): Promise<StudyDeskTopicItem[]> {
  const [topicsResponse, notesResponse] = await Promise.all([
    fetch(`/api/topics?subjectId=${encodeURIComponent(subjectId)}`),
    fetch(`/api/notes?subjectId=${encodeURIComponent(subjectId)}`),
  ])

  const topicsPayload = parseApiResponse<unknown[]>(await topicsResponse.json().catch(() => null))
  const notesPayload = parseApiResponse<unknown[]>(await notesResponse.json().catch(() => null))

  if (!topicsPayload.success || !Array.isArray(topicsPayload.data)) {
    return []
  }

  const notesByTopic = new Map<string, Note[]>()
  const notes = notesPayload.success && Array.isArray(notesPayload.data)
    ? notesPayload.data.map((item) => normalizeNote(item as NoteApiItem)).filter((note): note is Note => note !== null)
    : []

  for (const note of notes) {
    const existing = notesByTopic.get(note.topicId) ?? []
    existing.push(note)
    notesByTopic.set(note.topicId, existing)
  }

  return topicsPayload.data.map((item) => {
    const normalized = normalizeTopic(item as TopicApiItem)
    return {
      ...normalized,
      notes: notesByTopic.get(normalized.id) ?? [],
    }
  })
}

export function useStudyDesk() {
  const { subjects, loading: subjectsLoading, error: subjectsError, fetchSubjects } = useSubjects()
  const [topicsBySubject, setTopicsBySubject] = useState<StudyDeskTopicsBySubject>({})
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [topicsError, setTopicsError] = useState<string | null>(null)

  const loadTopics = useCallback(async (subjectList: Subject[]) => {
    if (subjectList.length === 0) {
      setTopicsBySubject({})
      setTopicsError(null)
      setTopicsLoading(false)
      return
    }

    setTopicsLoading(true)
    setTopicsError(null)

    try {
      const results = await Promise.all(
        subjectList.map(async (subject) => [subject.id, await fetchStudyDeskTopics(subject.id)] as const),
      )

      setTopicsBySubject(Object.fromEntries(results))
    } catch (error) {
      setTopicsError(error instanceof Error ? error.message : 'Unable to load topics and notes.')
    } finally {
      setTopicsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSubjects()
  }, [fetchSubjects])

  useEffect(() => {
    void loadTopics(subjects)
  }, [loadTopics, subjects])

  const refresh = useCallback(async () => {
    await fetchSubjects()
  }, [fetchSubjects])

  const updateTopicStatus = useCallback(async (subjectId: string, topicId: string, title: string) => {
    const previousTopics = topicsBySubject[subjectId] ?? []

    setTopicsBySubject((current) => {
      const subjectTopics = current[subjectId] ?? []
      return {
        ...current,
        [subjectId]: subjectTopics.map((topic) => (
          topic.id === topicId ? { ...topic, status: 'In Progress' } : topic
        )),
      }
    })

    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(topicId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'In Progress',
          title,
        }),
      })

      const payload = await response.json().catch(() => null)
      const result = parseApiResponse<unknown>(payload)

      if (!result.success) {
        throw new Error(result.error.message)
      }

      void fetch('/api/progress/subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, value: 25 }),
      }).catch(() => {})

      return true
    } catch (error) {
      setTopicsBySubject((current) => ({
        ...current,
        [subjectId]: previousTopics,
      }))
      setTopicsError(error instanceof Error ? error.message : 'Unable to update topic status.')
      return false
    }
  }, [topicsBySubject])

  const completeTopic = useCallback(async (subjectId: string, topicId: string, title: string) => {
    const previousTopics = topicsBySubject[subjectId] ?? []

    setTopicsBySubject((current) => {
      const subjectTopics = current[subjectId] ?? []
      return {
        ...current,
        [subjectId]: subjectTopics.map((topic) => (
          topic.id === topicId ? { ...topic, status: 'Completed' } : topic
        )),
      }
    })

    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(topicId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Completed',
          title,
        }),
      })

      const payload = await response.json().catch(() => null)
      const result = parseApiResponse<unknown>(payload)

      if (!result.success) {
        throw new Error(result.error.message)
      }

      // Optionally bump subject progress on completion
      void fetch('/api/progress/subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, value: 100 }),
      }).catch(() => {})

      return true
    } catch (error) {
      setTopicsBySubject((current) => ({
        ...current,
        [subjectId]: previousTopics,
      }))
      setTopicsError(error instanceof Error ? error.message : 'Unable to mark topic completed.')
      return false
    }
  }, [topicsBySubject])

  return {
    subjects,
    subjectsLoading,
    subjectsError,
    topicsBySubject,
    topicsLoading,
    topicsError,
    refresh,
    updateTopicStatus,
    completeTopic,
  }
}